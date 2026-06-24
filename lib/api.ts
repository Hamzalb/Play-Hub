import { ApiResponse } from '@/types';

// All calls go through the Next.js BFF proxy (/api/*) to avoid CORS.
// The proxy rewrites /api/:path* → http://localhost:5000/:path*
const API_BASE = '/api';

class ApiClient {
  private accessToken: string | null = null;

  setToken(token: string | null): void {
    this.accessToken = token;
  }

  getToken(): string | null {
    return this.accessToken;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',  // send cookies (refresh token) with every request
      ...options,
      headers: { ...headers, ...(options.headers as Record<string, string> | undefined) },
    });

    const json = (await res.json()) as ApiResponse<T>;
    return json;
  }

  get<T>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>(path);
  }

  post<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(path, { method: 'POST', body: JSON.stringify(body) });
  }

  put<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(path, { method: 'PUT', body: JSON.stringify(body) });
  }

  patch<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(path, { method: 'PATCH', body: JSON.stringify(body) });
  }

  delete<T>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>(path, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
