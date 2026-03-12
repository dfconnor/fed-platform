/**
 * Messages API Route
 *
 * GET  /api/messages - List conversations for the current user
 * POST /api/messages - Send a message to another user
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/messages
 * List all conversations for the current user. Groups messages by
 * the other participant and returns the latest message in each conversation
 * along with unread counts.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get all messages where user is sender or receiver, grouped by conversation partner
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: { id: true, name: true, image: true },
        },
        receiver: {
          select: { id: true, name: true, image: true },
        },
        booking: {
          select: {
            id: true,
            listing: {
              select: {
                id: true,
                title: true,
                images: { orderBy: { order: 'asc' }, take: 1 },
              },
            },
          },
        },
      },
    });

    // Group messages into conversations by the other participant
    const conversationMap = new Map<
      string,
      {
        conversationId: string;
        otherUser: { id: string; name: string | null; image: string | null };
        lastMessage: typeof messages[0];
        unreadCount: number;
        booking: typeof messages[0]['booking'] | null;
      }
    >();

    for (const msg of messages) {
      const otherUserId =
        msg.senderId === userId ? msg.receiverId : msg.senderId;
      const otherUser =
        msg.senderId === userId ? msg.receiver : msg.sender;

      // Use a composite key for conversation: sorted user IDs
      const conversationId = [userId, otherUserId].sort().join('_');

      if (!conversationMap.has(conversationId)) {
        conversationMap.set(conversationId, {
          conversationId,
          otherUser,
          lastMessage: msg,
          unreadCount: 0,
          booking: msg.booking,
        });
      }

      // Count unread messages sent to the current user
      if (msg.receiverId === userId && !msg.read) {
        const conv = conversationMap.get(conversationId)!;
        conv.unreadCount++;
      }
    }

    const conversations = Array.from(conversationMap.values()).sort(
      (a, b) =>
        b.lastMessage.createdAt.getTime() - a.lastMessage.createdAt.getTime()
    );

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('GET /api/messages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

/** Zod schema for sending a message */
const sendMessageSchema = z.object({
  receiverId: z.string().min(1),
  content: z.string().min(1).max(5000),
  bookingId: z.string().optional(),
});

/**
 * POST /api/messages
 * Send a message to another user. Optionally link the message to a booking.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = sendMessageSchema.parse(body);

    // Cannot message yourself
    if (data.receiverId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot send a message to yourself' },
        { status: 400 }
      );
    }

    // Verify receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: data.receiverId },
      select: { id: true },
    });

    if (!receiver) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 }
      );
    }

    // If bookingId is provided, verify the sender is part of that booking
    if (data.bookingId) {
      const booking = await prisma.booking.findUnique({
        where: { id: data.bookingId },
        select: { guestId: true, hostId: true },
      });

      if (!booking) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        );
      }

      if (
        booking.guestId !== session.user.id &&
        booking.hostId !== session.user.id
      ) {
        return NextResponse.json(
          { error: 'You are not a party to this booking' },
          { status: 403 }
        );
      }
    }

    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        receiverId: data.receiverId,
        content: data.content,
        bookingId: data.bookingId || null,
      },
      include: {
        sender: {
          select: { id: true, name: true, image: true },
        },
        receiver: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid message data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('POST /api/messages error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
