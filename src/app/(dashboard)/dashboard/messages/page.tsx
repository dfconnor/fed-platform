'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

interface Conversation {
  id: string;
  participant: {
    name: string;
    initials: string;
    role: 'host' | 'guest';
  };
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  unreadCount: number;
  booking: {
    ref: string;
    rv: string;
    dates: string;
    status: 'confirmed' | 'pending' | 'active' | 'completed';
  };
  messages: Message[];
}

const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    participant: {
      name: 'Mike Rodriguez',
      initials: 'MR',
      role: 'host',
    },
    lastMessage: 'Great! See you on the 22nd. I\'ll have everything ready for your arrival.',
    lastMessageTime: '2h ago',
    unread: true,
    unreadCount: 2,
    booking: {
      ref: 'BK-2401',
      rv: '2023 Thor Palazzo 37.5',
      dates: 'Mar 22 - Mar 29, 2026',
      status: 'confirmed',
    },
    messages: [
      {
        id: 'm1-1',
        senderId: 'me',
        text: 'Hi Mike! I just booked your Thor Palazzo for March 22-29. Really excited about the trip! Quick question - is there a specific check-in time?',
        timestamp: 'Mar 9, 2:15 PM',
        isOwn: true,
      },
      {
        id: 'm1-2',
        senderId: 'mike',
        text: 'Welcome! Great choice for a spring trip. Check-in is flexible, but I usually do the walkthrough between 2-4 PM so I can go through everything with you in daylight. Does that work?',
        timestamp: 'Mar 9, 2:45 PM',
        isOwn: false,
      },
      {
        id: 'm1-3',
        senderId: 'me',
        text: 'Perfect, 3 PM works great for us. Also, we have a small dog (20 lbs) - I saw pets are allowed with a fee. Is there anything special we should know?',
        timestamp: 'Mar 9, 3:10 PM',
        isOwn: true,
      },
      {
        id: 'm1-4',
        senderId: 'mike',
        text: 'Dogs are welcome! I just ask that you bring a crate or blanket for the furniture, and please don\'t leave them unattended in the RV. I\'ll add the $50 pet fee to the booking. I also have a list of dog-friendly campgrounds near RMNP if you\'re interested!',
        timestamp: 'Mar 9, 3:30 PM',
        isOwn: false,
      },
      {
        id: 'm1-5',
        senderId: 'me',
        text: 'That would be amazing, thank you! We\'ll definitely bring the crate. See you on the 22nd!',
        timestamp: 'Mar 9, 4:00 PM',
        isOwn: true,
      },
      {
        id: 'm1-6',
        senderId: 'mike',
        text: 'Great! See you on the 22nd. I\'ll have everything ready for your arrival.',
        timestamp: 'Mar 9, 4:15 PM',
        isOwn: false,
      },
    ],
  },
  {
    id: 'conv-2',
    participant: {
      name: 'Sandra Kim',
      initials: 'SK',
      role: 'host',
    },
    lastMessage: 'The weather should be beautiful in April. I\'d recommend bringing layers for the evening.',
    lastMessageTime: '1d ago',
    unread: false,
    unreadCount: 0,
    booking: {
      ref: 'BK-2415',
      rv: '2024 Winnebago View 24D',
      dates: 'Apr 14 - Apr 19, 2026',
      status: 'confirmed',
    },
    messages: [
      {
        id: 'm2-1',
        senderId: 'me',
        text: 'Hi Sandra! Looking forward to the Moab trip. Any campground recommendations near Arches?',
        timestamp: 'Mar 8, 10:00 AM',
        isOwn: true,
      },
      {
        id: 'm2-2',
        senderId: 'sandra',
        text: 'Hi there! Devil\'s Garden campground inside Arches is amazing if you can get a spot - they fill up fast though. Otherwise, Sun Outdoors Arches Gateway is a great option with full hookups. I\'d also recommend Dead Horse Point State Park campground for incredible views.',
        timestamp: 'Mar 8, 11:30 AM',
        isOwn: false,
      },
      {
        id: 'm2-3',
        senderId: 'me',
        text: 'Thanks for the tips! We managed to get a spot at Dead Horse Point. Any weather advice for mid-April?',
        timestamp: 'Mar 8, 1:00 PM',
        isOwn: true,
      },
      {
        id: 'm2-4',
        senderId: 'sandra',
        text: 'The weather should be beautiful in April. I\'d recommend bringing layers for the evening.',
        timestamp: 'Mar 8, 2:15 PM',
        isOwn: false,
      },
    ],
  },
  {
    id: 'conv-3',
    participant: {
      name: 'Jake Thompson',
      initials: 'JT',
      role: 'host',
    },
    lastMessage: 'Enjoy the rest of your trip! Let me know if you need anything at all.',
    lastMessageTime: '3d ago',
    unread: true,
    unreadCount: 1,
    booking: {
      ref: 'BK-2398',
      rv: '2022 Airstream Interstate 24GL',
      dates: 'Mar 8 - Mar 15, 2026',
      status: 'active',
    },
    messages: [
      {
        id: 'm3-1',
        senderId: 'me',
        text: 'Hi Jake, we\'re at the campsite and the Airstream is incredible! One quick question - how do I connect to the campground\'s water hookup?',
        timestamp: 'Mar 8, 5:00 PM',
        isOwn: true,
      },
      {
        id: 'm3-2',
        senderId: 'jake',
        text: 'Glad you made it! The water hookup is in the outside compartment on the driver\'s side. There\'s a white hose - connect it to the city water inlet (labeled in blue). Turn on slowly and check for leaks. The pressure regulator is already inline.',
        timestamp: 'Mar 8, 5:15 PM',
        isOwn: false,
      },
      {
        id: 'm3-3',
        senderId: 'me',
        text: 'Got it connected, works perfectly! This van is seriously amazing. The sunset from our site is unreal.',
        timestamp: 'Mar 8, 6:30 PM',
        isOwn: true,
      },
      {
        id: 'm3-4',
        senderId: 'jake',
        text: 'Enjoy the rest of your trip! Let me know if you need anything at all.',
        timestamp: 'Mar 8, 7:00 PM',
        isOwn: false,
      },
    ],
  },
];

const bookingStatusColors: Record<string, string> = {
  confirmed: 'bg-brand-100 text-brand-700',
  pending: 'bg-sunset-100 text-sunset-700',
  active: 'bg-sky-100 text-sky-700',
  completed: 'bg-gray-100 text-gray-600',
};

export default function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState<string>(mockConversations[0].id);
  const [newMessage, setNewMessage] = useState('');
  const [mobileShowThread, setMobileShowThread] = useState(false);

  const conversation = mockConversations.find((c) => c.id === activeConversation)!;

  const handleSend = () => {
    if (!newMessage.trim()) return;
    // Mock send - in production this would call an API
    setNewMessage('');
  };

  const selectConversation = (id: string) => {
    setActiveConversation(id);
    setMobileShowThread(true);
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <span className="text-sm text-gray-500">
          {mockConversations.filter((c) => c.unread).length} unread
        </span>
      </div>

      <div className="flex-1 flex bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-0">
        {/* Conversation List */}
        <div
          className={cn(
            'w-full md:w-80 lg:w-96 border-r border-gray-200 flex flex-col shrink-0',
            mobileShowThread ? 'hidden md:flex' : 'flex'
          )}
        >
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
              <input
                type="text"
                className="input-field !pl-10 !py-2 text-sm"
                placeholder="Search messages..."
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {mockConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => selectConversation(conv.id)}
                className={cn(
                  'w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-start gap-3',
                  activeConversation === conv.id && 'bg-brand-50/40',
                  conv.unread && 'bg-brand-50/20'
                )}
              >
                <div className="relative shrink-0">
                  <div className="h-11 w-11 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center text-sm font-semibold">
                    {conv.participant.initials}
                  </div>
                  {conv.unread && (
                    <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-brand-500 border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn('text-sm font-medium truncate', conv.unread ? 'text-gray-900' : 'text-gray-700')}>
                      {conv.participant.name}
                    </p>
                    <span className="text-xs text-gray-400 shrink-0">{conv.lastMessageTime}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{conv.booking.rv}</p>
                  <p className={cn('text-sm truncate mt-0.5', conv.unread ? 'text-gray-900 font-medium' : 'text-gray-500')}>
                    {conv.lastMessage}
                  </p>
                </div>
                {conv.unreadCount > 0 && (
                  <span className="h-5 min-w-[20px] rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center px-1.5 shrink-0 mt-1">
                    {conv.unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Message Thread */}
        <div
          className={cn(
            'flex-1 flex flex-col min-w-0',
            !mobileShowThread ? 'hidden md:flex' : 'flex'
          )}
        >
          {/* Thread Header */}
          <div className="p-4 border-b border-gray-100 flex items-center gap-3">
            <button
              onClick={() => setMobileShowThread(false)}
              className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 011.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="h-10 w-10 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center text-sm font-semibold shrink-0">
              {conversation.participant.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm">{conversation.participant.name}</p>
              <p className="text-xs text-gray-500">
                {conversation.participant.role === 'host' ? 'Host' : 'Guest'}
              </p>
            </div>
          </div>

          {/* Booking Context Banner */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-8 w-12 rounded-lg bg-gradient-to-br from-forest-100 to-brand-100 flex items-center justify-center shrink-0">
                <svg className="h-4 w-4 text-forest-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="1" y="6" width="22" height="12" rx="2" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{conversation.booking.rv}</p>
                <p className="text-xs text-gray-500">{conversation.booking.dates} &middot; {conversation.booking.ref}</p>
              </div>
            </div>
            <span className={cn('badge text-[10px] shrink-0', bookingStatusColors[conversation.booking.status])}>
              {conversation.booking.status}
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {conversation.messages.map((msg) => (
              <div
                key={msg.id}
                className={cn('flex', msg.isOwn ? 'justify-end' : 'justify-start')}
              >
                <div className={cn('max-w-[75%]')}>
                  <div
                    className={cn(
                      'rounded-2xl px-4 py-3 text-sm',
                      msg.isOwn
                        ? 'bg-brand-600 text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-900 rounded-bl-md'
                    )}
                  >
                    {msg.text}
                  </div>
                  <p
                    className={cn(
                      'text-[10px] text-gray-400 mt-1',
                      msg.isOwn ? 'text-right' : 'text-left'
                    )}
                  >
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <textarea
                  className="input-field !py-2.5 resize-none text-sm min-h-[44px] max-h-32"
                  placeholder="Type a message..."
                  rows={1}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className={cn(
                  'h-11 w-11 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                  newMessage.trim()
                    ? 'bg-brand-600 text-white hover:bg-brand-700'
                    : 'bg-gray-100 text-gray-400'
                )}
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
