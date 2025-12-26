import httpClient from "@/lib/httpClient/index";

export interface ChatRoom {
  id: string;
  type: 'match' | 'admin';
  matchId?: string;
  otherUserId?: string;
  otherUserName?: string;
  otherAdminId?: string;
  otherAdminName?: string;
  lastMessage?: {
    id: string;
    content: string;
    sender_id: string;
    created_at: string;
  } | null;
  unreadCount: number;
  createdAt: string;
}

export interface Message {
  id: string;
  chat_room_id: string;
  sender_id: string;
  receiver_id: string | null;
  content: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface GetChatRoomsResponse {
  success: boolean;
  rooms?: ChatRoom[];
  error?: string;
}

export interface GetMessagesResponse {
  success: boolean;
  messages?: Message[];
  error?: string;
}

export interface CreateAdminRoomResponse {
  success: boolean;
  roomId?: string;
  error?: string;
}

/**
 * Get all chat rooms for the current user
 */
export async function getChatRooms(): Promise<GetChatRoomsResponse> {
  try {
    const response = await httpClient.get<GetChatRoomsResponse>('/chat/rooms');
    return response.data;
  } catch (error: any) {
    console.error('[ChatAPI] Error fetching chat rooms:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to fetch chat rooms',
    };
  }
}

/**
 * Get messages for a chat room
 */
export async function getMessages(
  roomId: string,
  limit: number = 50,
  beforeMessageId?: string
): Promise<GetMessagesResponse> {
  try {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (beforeMessageId) {
      params.append('before', beforeMessageId);
    }

    const response = await httpClient.get<GetMessagesResponse>(
      `/chat/rooms/${roomId}/messages?${params.toString()}`
    );
    return response.data;
  } catch (error: any) {
    console.error('[ChatAPI] Error fetching messages:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to fetch messages',
    };
  }
}

/**
 * Get or create admin chat room
 */
export async function getOrCreateAdminRoom(otherAdminId: string): Promise<CreateAdminRoomResponse> {
  try {
    const response = await httpClient.post<CreateAdminRoomResponse>('/chat/admin/room', {
      otherAdminId,
    });
    return response.data;
  } catch (error: any) {
    console.error('[ChatAPI] Error getting/creating admin room:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to get or create admin room',
    };
  }
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(roomId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await httpClient.post(`/chat/rooms/${roomId}/read`);
    return response.data;
  } catch (error: any) {
    console.error('[ChatAPI] Error marking messages as read:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to mark messages as read',
    };
  }
}

