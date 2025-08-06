import { useState, useEffect, useCallback } from 'react';
import { apiService, MessageData, SendMessageRequest } from '../../../services/api';
import { Message } from '../chat-room-page/components/messages-list/data/get-messages';

// Convert backend message to frontend message format
const convertToFrontendMessage = (backendMsg: MessageData, currentUserId: string): Message => {
  const date = new Date(backendMsg.createdAt);
  return {
    id: backendMsg.id,
    body: backendMsg.message,
    date: date.toLocaleDateString('en-GB'),
    timestamp: date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    messageStatus: backendMsg.status.toUpperCase() as any,
    isOpponent: backendMsg.senderId !== currentUserId,
  };
};

// Convert frontend message to backend format
const convertToBackendMessage = (message: string, senderId: string, receiverId: string): SendMessageRequest => ({
  senderId,
  receiverId,
  message,
});

export interface UseMessagingReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  refreshMessages: () => Promise<void>;
  isConnected: boolean;
}

export const useMessaging = (currentUserId: string, selectedContactId: string): UseMessagingReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Test backend connection
  useEffect(() => {
    const testConnection = async () => {
      const connected = await apiService.testConnection();
      setIsConnected(connected);
    };
    testConnection();
  }, []);

  // Fetch messages for the current conversation
  const refreshMessages = useCallback(async () => {
    if (!currentUserId || !selectedContactId) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const backendMessages = await apiService.getConversationMessages(currentUserId, selectedContactId);
      const frontendMessages = backendMessages.map(msg => convertToFrontendMessage(msg, currentUserId));
      setMessages(frontendMessages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch messages';
      setError(errorMessage);
      console.error('Error fetching messages:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, selectedContactId]);

  // Send a new message
  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || !currentUserId || !selectedContactId) return;

    setError(null);
    
    try {
      const messageData = convertToBackendMessage(messageText.trim(), currentUserId, selectedContactId);
      const response = await apiService.sendMessage(messageData);
      
      if (response.data) {
        // Add the new message to the local state immediately
        const newMessage = convertToFrontendMessage(response.data, currentUserId);
        setMessages(prev => [...prev, newMessage]);
      }

      // Optionally refresh all messages to get any missed messages
      // await refreshMessages();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      console.error('Error sending message:', err);
      throw err; // Re-throw so the UI can handle it
    }
  }, [currentUserId, selectedContactId]);

  // Load messages when the conversation changes
  useEffect(() => {
    if (currentUserId && selectedContactId && isConnected) {
      refreshMessages();
    }
  }, [currentUserId, selectedContactId, isConnected, refreshMessages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    refreshMessages,
    isConnected,
  };
};