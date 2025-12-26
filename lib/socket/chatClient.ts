import { io, Socket } from 'socket.io-client';

/**
 * Socket.io Chat Client
 * Manages real-time chat connections with automatic reconnection
 */

class ChatClient {
  private socket: Socket | null = null;
  private isConnecting = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  /**
   * Connect to Socket.io server
   */
  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        // Wait for existing connection attempt
        const checkConnection = setInterval(() => {
          if (this.socket?.connected) {
            clearInterval(checkConnection);
            resolve();
          } else if (!this.isConnecting) {
            clearInterval(checkConnection);
            reject(new Error('Connection failed'));
          }
        }, 100);
        return;
      }

      this.isConnecting = true;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const socketUrl = apiUrl.replace('/api', '');

      this.socket = io(socketUrl, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: this.maxReconnectAttempts,
      });

      this.socket.on('connect', () => {
        console.log('[ChatClient] Connected to server');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('[ChatClient] Connection error:', error);
        this.isConnecting = false;
        this.reconnectAttempts++;
        
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          reject(error);
        }
      });

      this.socket.on('disconnect', (reason) => {
        console.log('[ChatClient] Disconnected:', reason);
        if (reason === 'io server disconnect') {
          // Server disconnected, reconnect manually
          this.socket?.connect();
        }
      });

      this.socket.on('error', (error) => {
        console.error('[ChatClient] Socket error:', error);
      });
    });
  }

  /**
   * Disconnect from server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
      this.reconnectAttempts = 0;
    }
  }

  /**
   * Join a chat room
   */
  joinRoom(roomId: string) {
    if (!this.socket?.connected) {
      console.warn('[ChatClient] Socket not connected, cannot join room');
      return;
    }
    this.socket.emit('join_room', { roomId });
  }

  /**
   * Leave a chat room
   */
  leaveRoom(roomId: string) {
    if (!this.socket?.connected) {
      return;
    }
    this.socket.emit('leave_room', { roomId });
  }

  /**
   * Send a message
   */
  sendMessage(roomId: string, content: string, receiverId?: string) {
    if (!this.socket?.connected) {
      console.warn('[ChatClient] Socket not connected, cannot send message');
      return;
    }
    this.socket.emit('send_message', { roomId, content, receiverId });
  }

  /**
   * Send typing indicator
   */
  setTyping(roomId: string, isTyping: boolean) {
    if (!this.socket?.connected) {
      return;
    }
    this.socket.emit('typing', { roomId, isTyping });
  }

  /**
   * Mark messages as read
   */
  markAsRead(roomId: string) {
    if (!this.socket?.connected) {
      return;
    }
    this.socket.emit('mark_read', { roomId });
  }

  /**
   * Subscribe to new messages
   */
  onMessage(callback: (data: { roomId: string; message: any }) => void) {
    if (!this.socket) {
      return () => {};
    }
    this.socket.on('new_message', callback);
    return () => {
      this.socket?.off('new_message', callback);
    };
  }

  /**
   * Subscribe to message history
   */
  onMessageHistory(callback: (data: { roomId: string; messages: any[] }) => void) {
    if (!this.socket) {
      return () => {};
    }
    this.socket.on('messages_history', callback);
    return () => {
      this.socket?.off('messages_history', callback);
    };
  }

  /**
   * Subscribe to typing indicators
   */
  onTyping(callback: (data: { userId: string; roomId: string; isTyping: boolean }) => void) {
    if (!this.socket) {
      return () => {};
    }
    this.socket.on('user_typing', callback);
    return () => {
      this.socket?.off('user_typing', callback);
    };
  }

  /**
   * Subscribe to user joined/left events
   */
  onUserJoined(callback: (data: { userId: string; roomId: string }) => void) {
    if (!this.socket) {
      return () => {};
    }
    this.socket.on('user_joined', callback);
    return () => {
      this.socket?.off('user_joined', callback);
    };
  }

  onUserLeft(callback: (data: { userId: string; roomId: string }) => void) {
    if (!this.socket) {
      return () => {};
    }
    this.socket.on('user_left', callback);
    return () => {
      this.socket?.off('user_left', callback);
    };
  }

  /**
   * Subscribe to errors
   */
  onError(callback: (error: { message: string }) => void) {
    if (!this.socket) {
      return () => {};
    }
    this.socket.on('error', callback);
    return () => {
      this.socket?.off('error', callback);
    };
  }

  /**
   * Subscribe to message notifications (when user is not in room)
   */
  onMessageNotification(callback: (data: { roomId: string; message: any }) => void) {
    if (!this.socket) {
      return () => {};
    }
    this.socket.on('message_notification', callback);
    return () => {
      this.socket?.off('message_notification', callback);
    };
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export default new ChatClient();

