// Client-side only utilities
export function getAuthToken(): string | undefined {
  if (typeof document === 'undefined') {
    // Running on server, shouldn't happen
    console.warn('getAuthToken called on server side');
    return undefined;
  }

  return document.cookie
    .split('; ')
    .find(row => row.startsWith('auth_token='))
    ?.split('=')[1];
}

export async function fetchWithAuth(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const token = getAuthToken();
  const headers = new Headers(init?.headers);
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  // Only set cache control if not already set
  if (!headers.has('cache-control') && !init?.cache) {
    headers.set('cache-control', 'no-cache');
  }
  
  const options: RequestInit = {
    ...init,
    headers,
    credentials: 'include',
    mode: 'cors',
  };

  return fetch(input, options);
}

export function getApiUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
}
