"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiSend, FiPaperclip, FiSearch } from "react-icons/fi";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import chatClient from "@/lib/socket/chatClient";
import { getChatRooms, getMessages, markMessagesAsRead, type ChatRoom, type Message } from "@/lib/api/chat";
import { toast } from "react-toastify";

export default function Chats() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, role } = useAuthGuard({ allowRoles: ['users', 'admin', 'superAdmin'] });
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);
  const socketConnectedRef = useRef(false);
  const userIdRef = useRef<string | null>(null);

  // Connect to Socket.io on mount (only once per user)
  useEffect(() => {
    if (!user?.id) return;
    
    // If already connected for this user, don't reconnect
    if (socketConnectedRef.current && userIdRef.current === user.id && chatClient.isConnected()) {
      return;
    }

    const connectSocket = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token && !chatClient.isConnected()) {
          await chatClient.connect(token);
          console.log('[Chats] Socket connected');
          socketConnectedRef.current = true;
          userIdRef.current = user.id || null;
        }
      } catch (error) {
        console.error('[Chats] Failed to connect socket:', error);
        socketConnectedRef.current = false;
        // Don't show error toast on every failed attempt, only on first failure
        if (!socketConnectedRef.current) {
          toast.error('Failed to connect to chat server. Chat features may be limited.');
        }
      }
    };

    connectSocket();

    return () => {
      // Only disconnect on unmount, not on every re-render
      // The socket client handles reconnection automatically
    };
  }, [user?.id]); // Use user.id instead of user object

  // Load chat rooms
  useEffect(() => {
    if (!user?.id) return;

    const loadChatRooms = async () => {
      setLoading(true);
      try {
        const result = await getChatRooms();
        if (result.success && result.rooms) {
          setChatRooms(result.rooms);
          
          // Check if there's a match ID in URL params
          const matchId = searchParams.get('match');
          if (matchId) {
            const room = result.rooms.find(r => r.matchId === matchId);
            if (room) {
              setSelectedRoom(room);
            }
          }
        } else {
          toast.error(result.error || 'Failed to load chat rooms');
        }
      } catch (error) {
        console.error('[Chats] Error loading chat rooms:', error);
        toast.error('Failed to load chat rooms');
      } finally {
        setLoading(false);
      }
    };

    loadChatRooms();
  }, [user?.id, searchParams]); // Use user.id instead of user object

  // Join room and load messages when selected
  useEffect(() => {
    if (!selectedRoom) return;

    const loadRoomMessages = async () => {
      try {
        // Load message history (works even without socket connection)
        const result = await getMessages(selectedRoom.id, 50);
        if (result.success && result.messages) {
          setMessages(result.messages);
          // Mark as read
          await markMessagesAsRead(selectedRoom.id);
        }

        // Scroll to bottom
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);

        // Join the room via Socket.io if connected (for real-time updates)
        if (chatClient.isConnected()) {
          chatClient.joinRoom(selectedRoom.id);
        }
      } catch (error) {
        console.error('[Chats] Error loading messages:', error);
      }
    };

    loadRoomMessages();

    // Set up Socket.io listeners (only if socket is connected)
    let unsubscribeMessage = () => {};
    let unsubscribeHistory = () => {};
    let unsubscribeTyping = () => {};
    let unsubscribeError = () => {};

    if (chatClient.isConnected()) {
      unsubscribeMessage = chatClient.onMessage((data) => {
        if (data.roomId === selectedRoom.id) {
          setMessages(prev => [...prev, data.message]);
          // Mark as read if user is viewing
          markMessagesAsRead(selectedRoom.id);
          chatClient.markAsRead(selectedRoom.id);
          // Scroll to bottom
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      });

      unsubscribeHistory = chatClient.onMessageHistory((data) => {
        if (data.roomId === selectedRoom.id) {
          setMessages(data.messages);
        }
      });

      unsubscribeTyping = chatClient.onTyping((data) => {
        if (data.roomId === selectedRoom.id && data.userId !== user?.id) {
          if (data.isTyping) {
            setTypingUsers(prev => new Set(prev).add(data.userId));
          } else {
            setTypingUsers(prev => {
              const newSet = new Set(prev);
              newSet.delete(data.userId);
              return newSet;
            });
          }
        }
      });

      unsubscribeError = chatClient.onError((error) => {
        toast.error(error.message);
      });
    }

    return () => {
      if (chatClient.isConnected()) {
        chatClient.leaveRoom(selectedRoom.id);
      }
      unsubscribeMessage();
      unsubscribeHistory();
      unsubscribeTyping();
      unsubscribeError();
    };
  }, [selectedRoom, user?.id]); // Use user.id instead of user object

  // Handle sending message
  const handleSendMessage = useCallback(async () => {
    if (!selectedRoom || !messageInput.trim() || sending) return;

    const content = messageInput.trim();
    setMessageInput("");
    setSending(true);

    try {
      // Determine receiver ID
      const receiverId = selectedRoom.type === 'match' 
        ? selectedRoom.otherUserId 
        : selectedRoom.otherAdminId;

      // Send via Socket.io
      chatClient.sendMessage(selectedRoom.id, content, receiverId || undefined);

      // Stop typing indicator
      if (isTypingRef.current) {
        chatClient.setTyping(selectedRoom.id, false);
        isTypingRef.current = false;
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }
    } catch (error) {
      console.error('[Chats] Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  }, [selectedRoom, messageInput, sending]);

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    if (!selectedRoom || !chatClient.isConnected()) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      chatClient.setTyping(selectedRoom.id, true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current) {
        chatClient.setTyping(selectedRoom.id, false);
        isTypingRef.current = false;
      }
    }, 3000);
  }, [selectedRoom]);

  // Filter chat rooms based on search
  const filteredRooms = chatRooms.filter(room => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    // Search in last message content
    if (room.lastMessage?.content.toLowerCase().includes(query)) {
      return true;
    }
    // Could also search by user name if available
    return false;
  });

  // Get other user's name for display
  const getRoomDisplayName = (room: ChatRoom): string => {
    if (room.type === 'admin') {
      return room.otherAdminName || 'Admin Chat';
    }
    return room.otherUserName || 'Match Chat';
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#EDD4D3]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#702C3E] mx-auto"></div>
          <p className="mt-4 text-[#702C3E] font-medium">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex bg-[#EDD4D3] h-full overflow-hidden">
      {/* Chat Rooms Sidebar */}
      <div className="w-full sm:w-80 border-r border-[#E6DADA] bg-[#F5E5E4] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#E6DADA]">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#702C3E] mb-3">Chats</h2>
          
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A4A4A]" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#E6DADA] rounded-lg text-sm text-[#2F2E2E] focus:outline-none focus:ring-2 focus:ring-[#702C3E]/20"
            />
          </div>
        </div>

        {/* Chat Rooms List */}
        <div className="flex-1 overflow-y-auto">
          {filteredRooms.length === 0 ? (
            <div className="p-4 text-center text-[#5A4A4A]">
              <p className="text-sm font-medium">No chats found</p>
            </div>
          ) : (
            <div className="divide-y divide-[#E6DADA]">
              {filteredRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`w-full p-4 text-left hover:bg-[#EDD4D3] transition-colors ${
                    selectedRoom?.id === room.id ? 'bg-[#EDD4D3]' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#702C3E] truncate">
                        {getRoomDisplayName(room)}
                      </p>
                      {room.lastMessage && (
                        <p className="text-xs text-[#5A4A4A] truncate mt-1">
                          {room.lastMessage.content}
                        </p>
                      )}
                      {!room.lastMessage && (
                        <p className="text-xs text-[#5A4A4A] mt-1">No messages yet</p>
                      )}
                    </div>
                    {room.unreadCount > 0 && (
                      <span className="bg-[#702C3E] text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        {room.unreadCount > 9 ? '9+' : room.unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat View */}
      {selectedRoom ? (
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="p-4 border-b border-[#E6DADA] bg-[#F5E5E4]">
            <h3 className="text-lg font-semibold text-[#702C3E]">
              {getRoomDisplayName(selectedRoom)}
            </h3>
            {typingUsers.size > 0 && (
              <p className="text-xs text-[#5A4A4A] mt-1 italic">
                {Array.from(typingUsers).map(id => `User ${id.slice(0, 4)}`).join(', ')} typing...
              </p>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-[#5A4A4A] font-medium">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => {
                const isOwn = message.sender_id === user?.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        isOwn
                          ? 'bg-[#702C3E] text-white'
                          : 'bg-[#F6E7EA] text-[#2F2E2E]'
                      }`}
                    >
                      <p className="text-sm font-medium break-words">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        isOwn ? 'text-white/70' : 'text-[#5A4A4A]'
                      }`}>
                        {new Date(message.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-[#E6DADA] bg-[#F5E5E4]">
            <div className="flex items-center gap-2">
              <button
                className="p-2 text-[#5A4A4A] hover:text-[#702C3E] hover:bg-white/60 rounded-md transition"
                aria-label="Attach file"
              >
                <FiPaperclip className="w-5 h-5" />
              </button>
              <input
                ref={messageInputRef}
                type="text"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => {
                  setMessageInput(e.target.value);
                  handleTyping();
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-1 px-4 py-2 bg-white border border-[#E6DADA] rounded-full text-sm text-[#2F2E2E] focus:outline-none focus:ring-2 focus:ring-[#702C3E]/20"
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim() || sending}
                className="p-2 text-[#702C3E] hover:bg-white/60 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <FiSend className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-[#5A4A4A] font-medium">Select a chat to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
}
