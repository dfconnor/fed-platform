/**
 * Conversation API Route
 *
 * GET   /api/messages/:conversationId - Fetch messages in a conversation
 * PATCH /api/messages/:conversationId - Mark messages as read
 *
 * The conversationId is a composite key of two sorted user IDs joined by "_".
 * Example: "cluser123_cluser456"
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: { conversationId: string };
}

/**
 * Parse a conversationId into the two user IDs.
 * The conversationId is formatted as "userId1_userId2" (sorted alphabetically).
 */
function parseConversationId(conversationId: string): {
  userIds: [string, string];
} | null {
  const parts = conversationId.split('_');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return null;
  }
  return { userIds: [parts[0], parts[1]] };
}

/**
 * GET /api/messages/:conversationId
 * Fetch all messages in a conversation between two users.
 * Supports pagination with cursor-based loading.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = parseConversationId(params.conversationId);
    if (!parsed) {
      return NextResponse.json(
        { error: 'Invalid conversation ID' },
        { status: 400 }
      );
    }

    const { userIds } = parsed;

    // Verify the authenticated user is part of this conversation
    if (!userIds.includes(session.user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const otherUserId = userIds.find((id) => id !== session.user.id)!;

    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: session.user.id },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1, // fetch one extra for cursor
      ...(cursor
        ? {
            cursor: { id: cursor },
            skip: 1, // skip the cursor itself
          }
        : {}),
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
              select: { id: true, title: true },
            },
          },
        },
      },
    });

    // Determine if there are more messages
    const hasMore = messages.length > limit;
    const messagesPage = hasMore ? messages.slice(0, limit) : messages;
    const nextCursor = hasMore
      ? messagesPage[messagesPage.length - 1].id
      : null;

    // Get other user's info
    const otherUser = await prisma.user.findUnique({
      where: { id: otherUserId },
      select: { id: true, name: true, image: true },
    });

    return NextResponse.json({
      messages: messagesPage,
      otherUser,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error('GET /api/messages/[conversationId] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/messages/:conversationId
 * Mark all unread messages from the other user in this conversation as read.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = parseConversationId(params.conversationId);
    if (!parsed) {
      return NextResponse.json(
        { error: 'Invalid conversation ID' },
        { status: 400 }
      );
    }

    const { userIds } = parsed;

    // Verify the authenticated user is part of this conversation
    if (!userIds.includes(session.user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const otherUserId = userIds.find((id) => id !== session.user.id)!;

    // Mark all messages from the other user to the current user as read
    const result = await prisma.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: session.user.id,
        read: false,
      },
      data: { read: true },
    });

    return NextResponse.json({
      markedAsRead: result.count,
    });
  } catch (error) {
    console.error('PATCH /api/messages/[conversationId] error:', error);
    return NextResponse.json(
      { error: 'Failed to mark messages as read' },
      { status: 500 }
    );
  }
}
