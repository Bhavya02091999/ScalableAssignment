import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { getApiUrl } from './utils';

class ApiClient {
  private static instances: Record<string, ApiClient> = {};
  private client: AxiosInstance;
  private baseURL: string;

  private constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  public static getInstance(service: 'auth' | 'course' | 'feedback' | 'admin'): ApiClient {
    const urls = {
      auth: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL,
      course: process.env.NEXT_PUBLIC_COURSE_SERVICE_URL,
      feedback: process.env.NEXT_PUBLIC_FEEDBACK_SERVICE_URL,
      admin: process.env.NEXT_PUBLIC_ADMIN_SERVICE_URL,
    };

    if (!ApiClient.instances[service]) {
      const baseURL = urls[service];
      if (!baseURL) {
        throw new Error(`Service URL for ${service} is not configured`);
      }
      ApiClient.instances[service] = new ApiClient(baseURL);
    }
    return ApiClient.instances[service];
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // The token will be sent via httpOnly cookie automatically
        // We don't need to set it in the Authorization header here
        // as it will be handled by the browser
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;
        
        // If the error status is 401, redirect to login
        if (error.response?.status === 401) {
          if (typeof window !== 'undefined' && window.location.pathname !== '/auth/login') {
            // Store the current URL for redirecting back after login
            const callbackUrl = window.location.pathname !== '/' 
              ? `?callbackUrl=${encodeURIComponent(window.location.pathname)}` 
              : '';
            window.location.href = `/auth/login${callbackUrl}`;
          }
        }
        
        // Handle common API errors
        if (error.response) {
          const { status, data } = error.response as AxiosResponse<{ error?: string; message?: string }>;
          const errorMessage = data?.error || data?.message || 'An error occurred';
          
          // You can add more specific error handling here based on status codes
          switch (status) {
            case 400:
              console.error('Bad Request:', errorMessage);
              break;
            case 403:
              console.error('Forbidden:', errorMessage);
              break;
            case 404:
              console.error('Not Found:', errorMessage);
              break;
            case 500:
              console.error('Server Error:', errorMessage);
              break;
            default:
              console.error(`Error ${status}:`, errorMessage);
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response from server');
        } else {
          // Something happened in setting up the request
          console.error('Request error:', error.message);
        }
        
        return Promise.reject(error);
      }
    );
  }

  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

// Export individual service clients
export const authClient = ApiClient.getInstance('auth');
export const courseClient = ApiClient.getInstance('course');
export const feedbackClient = ApiClient.getInstance('feedback');
export const adminClient = ApiClient.getInstance('admin');
