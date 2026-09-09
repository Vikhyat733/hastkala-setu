/**
 * API Client abstraction connecting to FastAPI backend (/api/v1)
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export interface HealthResponse {
  status: string;
  service: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async checkHealth(): Promise<HealthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API health check failed with HTTP ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.warn('Backend currently unreachable or offline, using fallback state:', err);
      return {
        status: 'offline',
        service: 'MELA API (Offline/Mock Mode)',
      };
    }
  }
}

export const apiClient = new ApiClient();
