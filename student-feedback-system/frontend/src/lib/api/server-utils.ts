import { cookies } from 'next/headers';

export async function getServerAuthToken(): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth_token');
    return authCookie?.value;
  } catch (error) {
    console.error('Error getting auth token from server cookies:', error);
    return undefined;
  }
}

export async function fetchWithServerAuth(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const token = await getServerAuthToken();
  const headers = new Headers(init?.headers);
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  const options: RequestInit = {
    ...init,
    headers,
    credentials: 'include',
  };

  return fetch(input, options);
}
