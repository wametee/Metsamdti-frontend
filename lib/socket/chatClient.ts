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
      // If already connected, resolve immediately
      if (this.socket?.connected) {
        resolve();
        return;
      }

      // If already connecting, wait for that connection
      if (this.isConnecting) {
        const checkConnection = setInterval(() => {
          if (this.socket?.connected) {
            clearInterval(checkConnection);
            resolve();
          } else if (!this.isConnecting && !this.socket) {
            clearInterval(checkConnection);
            reject(new Error('Connection failed'));
          }
        }, 100);
        
        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkConnection);
          if (!this.socket?.connected) {
            reject(new Error('Connection timeout'));
          }
        }, 10000);
        return;
      }

      this.isConnecting = true;

      // Construct socket URL properly
      let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      // Remove trailing slashes
      apiUrl = apiUrl.replace(/\/+$/, '');
      
      // Remove /api suffix if present (Socket.io connects to root, not /api)
      if (apiUrl.endsWith('/api')) {
        apiUrl = apiUrl.slice(0, -4);
      }
      
      // Ensure we have a valid URL
      if (!apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
        apiUrl = `https://${apiUrl}`;
      }

      console.log('[ChatClient] Connecting to:', apiUrl);

      this.socket = io(apiUrl, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: this.maxReconnectAttempts,
        timeout: 20000, // 20 second timeout
        forceNew: false, // Reuse existing connection if available
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
        // Don't manually reconnect - let Socket.io handle it automatically
        // Manual reconnection can cause loops
        if (reason === 'io client disconnect') {
          // Client intentionally disconnected, don't reconnect
          this.isConnecting = false;
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
      // Disconnect without reconnection
      this.socket.disconnect();
      this.socket.removeAllListeners();
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



