import { Portfolio } from '../types/portfolio';
import { API_BASE_URL, IS_DEVELOPMENT, ENABLE_DEBUG } from '../config/env';

// API client dengan error handling
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    
    // Log API base URL in development
    if (IS_DEVELOPMENT && ENABLE_DEBUG) {
      console.log('🌐 API Client initialized with base URL:', this.baseURL);
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...options.headers,
      },
      ...options,
    };

    if (IS_DEVELOPMENT && ENABLE_DEBUG) {
      console.log(`🔄 API Request: ${options.method || 'GET'} ${url}`);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.text().catch(() => '');
        const errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        if (IS_DEVELOPMENT && ENABLE_DEBUG) {
          console.error('❌ API Error:', errorMessage, errorData);
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      if (IS_DEVELOPMENT && ENABLE_DEBUG) {
        console.log('✅ API Response:', data);
      }
      
      return data;
    } catch (error) {
      if (IS_DEVELOPMENT && ENABLE_DEBUG) {
        console.error('❌ API request failed:', error);
      }
      
      // Provide more user-friendly error messages
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Tidak dapat terhubung ke server. Pastikan backend Laravel berjalan di ' + this.baseURL);
      }
      
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL);

// API response types
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

// Portfolio API functions
export const portfolioApi = {
  // Get all portfolios
  async getAllPortfolios(): Promise<Portfolio[]> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Portfolio>>>('/portfolios');
    return response.data.data;
  },

  // Get portfolio by ID
  async getPortfolioById(id: string): Promise<Portfolio | null> {
    try {
      const response = await apiClient.get<ApiResponse<Portfolio>>(`/portfolios/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      return null;
    }
  },

  // Search portfolios
  async searchPortfolios(query: string): Promise<Portfolio[]> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Portfolio>>>(
      `/portfolios/search?q=${encodeURIComponent(query)}`
    );
    return response.data.data;
  },

  // Filter portfolios by skill
  async filterPortfoliosBySkill(skill: string): Promise<Portfolio[]> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Portfolio>>>(
      `/portfolios/filter?skill=${encodeURIComponent(skill)}`
    );
    return response.data.data;
  },

  // Create new portfolio
  async createPortfolio(portfolio: Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'>): Promise<Portfolio> {
    const response = await apiClient.post<ApiResponse<Portfolio>>('/portfolios', portfolio);
    return response.data;
  },

  // Update portfolio
  async updatePortfolio(id: string, portfolio: Partial<Portfolio>): Promise<Portfolio> {
    const response = await apiClient.put<ApiResponse<Portfolio>>(`/portfolios/${id}`, portfolio);
    return response.data;
  },

  // Delete portfolio
  async deletePortfolio(id: string): Promise<void> {
    await apiClient.delete(`/portfolios/${id}`);
  },

  // Get portfolio statistics
  async getPortfolioStats(): Promise<{
    total: number;
    bySkill: { [skill: string]: number };
    byLocation: { [location: string]: number };
  }> {
    const response = await apiClient.get<ApiResponse<any>>('/portfolios/stats');
    return response.data;
  }
};

// Skills API functions
export const skillsApi = {
  // Get popular skills
  async getPopularSkills(): Promise<string[]> {
    const response = await apiClient.get<ApiResponse<string[]>>('/skills/popular');
    return response.data;
  },

  // Get all skills
  async getAllSkills(): Promise<string[]> {
    const response = await apiClient.get<ApiResponse<string[]>>('/skills');
    return response.data;
  }
};

// Export API client for custom requests
export { apiClient };

// Health check function with detailed status
export async function healthCheck(): Promise<{
  isHealthy: boolean;
  message: string;
  timestamp: string;
}> {
  try {
    const response = await apiClient.get<{ status: string; message?: string }>('/health');
    return {
      isHealthy: response.status === 'OK',
      message: response.message || 'API server is running normally',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      isHealthy: false,
      message: `API health check failed: ${errorMessage}`,
      timestamp: new Date().toISOString()
    };
  }
}

// Simple boolean health check for backward compatibility
export async function isApiHealthy(): Promise<boolean> {
  const health = await healthCheck();
  return health.isHealthy;
}