import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const POLL_INTERVAL_MS = 2000;
const MAX_DURATION_MS = 5 * 60 * 1000; // close after 5 min so connections don't hang forever

/**
 * Server-Sent Events endpoint that streams order status updates.
 *
 * Auth: same rules as GET /api/orders/[id] — order customer, restaurant
 * owner, admin, or anyone holding a guest order id.
 *
 * Implementation: polls Prisma every 2s and emits a `status` event whenever
 * the status changes. We use polling rather than Postgres LISTEN/NOTIFY
 * because Neon's serverless driver doesn't support persistent connections.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Initial load + access check
  const initial = await prisma.order.findFirst({
    where: { OR: [{ id }, { orderNumber: id }] },
    select: {
      id: true,
      status: true,
      customerId: true,
      restaurantId: true,
    },
  });

  if (!initial) {
    return new Response(JSON.stringify({ error: "Order not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const session = await auth();
  const userId = session?.user?.id;
  const userRole = session?.user?.role;

  const isOrderCustomer = initial.customerId && initial.customerId === userId;
  const isAdmin = userRole === "admin";
  const isGuestOrder = !initial.customerId;

  let isRestaurantOwner = false;
  if (userId && !isOrderCustomer && !isAdmin) {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: initial.restaurantId },
      select: { ownerId: true },
    });
    isRestaurantOwner = restaurant?.ownerId === userId;
  }

  if (!isGuestOrder && !isOrderCustomer && !isRestaurantOwner && !isAdmin) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();
  let lastStatus = initial.status;
  let pollTimer: ReturnType<typeof setInterval> | null = null;
  let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  let closeTimer: ReturnType<typeof setTimeout> | null = null;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        try {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
          );
        } catch {
          // Controller already closed — ignore
        }
      };

      // Initial snapshot
      send("status", { status: lastStatus, orderId: initial.id });

      const cleanup = () => {
        if (pollTimer) clearInterval(pollTimer);
        if (heartbeatTimer) clearInterval(heartbeatTimer);
        if (closeTimer) clearTimeout(closeTimer);
        try {
          controller.close();
        } catch {
          // already closed
        }
      };

      // Heartbeat every 20s — keeps proxies/load balancers from closing the connection
      heartbeatTimer = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": ping\n\n"));
        } catch {
          cleanup();
        }
      }, 20000);

      pollTimer = setInterval(async () => {
        try {
          const fresh = await prisma.order.findUnique({
            where: { id: initial.id },
            select: { status: true },
          });
          if (!fresh) return;
          if (fresh.status !== lastStatus) {
            lastStatus = fresh.status;
            send("status", { status: fresh.status, orderId: initial.id });
            // Terminal state: stop streaming
            if (fresh.status === "completed" || fresh.status === "cancelled") {
              send("done", { status: fresh.status });
              cleanup();
            }
          }
        } catch {
          // Transient error — keep polling
        }
      }, POLL_INTERVAL_MS);

      // Hard upper bound on connection lifetime
      closeTimer = setTimeout(cleanup, MAX_DURATION_MS);

      // Client disconnect
      req.signal.addEventListener("abort", cleanup);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
