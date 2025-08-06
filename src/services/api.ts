// API Configuration - Using local backend server
const API_BASE_URL = 'http://localhost:3001'; // Local backend server

// API Response Types
export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  count?: number;
}

export interface MessageData {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  status: string;
  createdAt: string;
}

export interface SendMessageRequest {
  senderId: string;
  receiverId: string;
  message: string;
}

// API Service Class
class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Generic fetch wrapper with error handling
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      console.log(`🚀 API Request: ${config.method || 'GET'} ${url}`, config.body ? JSON.parse(config.body as string) : {});

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      console.log(`✅ API Response:`, data);
      return data;
    } catch (error) {
      console.error(`❌ API Error:`, error);
      throw error;
    }
  }

  // Send a message to backend
  async sendMessage(messageData: SendMessageRequest): Promise<ApiResponse<MessageData>> {
    return this.request<MessageData>('/sendMessage', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  // Get all messages from backend
  async getMessages(limit: number = 50): Promise<ApiResponse<MessageData[]>> {
    return this.request<MessageData[]>(`/getMessages?limit=${limit}`);
  }

  // Get messages for a specific user conversation
  async getConversationMessages(senderId: string, receiverId: string, limit: number = 50): Promise<MessageData[]> {
    try {
      const response = await this.getMessages(limit);
      const allMessages = response.data || [];
      
      // Filter messages for this specific conversation
      const conversationMessages = allMessages.filter(msg => 
        (msg.senderId === senderId && msg.receiverId === receiverId) ||
        (msg.senderId === receiverId && msg.receiverId === senderId)
      );

      // Sort by creation date
      return conversationMessages.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
      return [];
    }
  }

  // Test connection to backend
  async testConnection(): Promise<boolean> {
    try {
      await this.getMessages(1);
      console.log('🟢 Backend connection successful');
      return true;
    } catch (error) {
      console.error('🔴 Backend connection failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export for easy access
export default apiService;