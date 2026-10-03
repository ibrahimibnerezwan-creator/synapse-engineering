export async function readJson<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error || (response.status === 401 ? 'Your session expired. Log in again.' : 'The request failed. Please try again.'));
  if (!data) throw new Error('The server returned an unreadable response. Please try again.');
  return data as T;
}

export const errorText = (error: unknown) => error instanceof Error ? error.message : 'Something went wrong. Please try again.';

export function whatsappPhone(phone: string) {
  const digits = phone.replace(/[^0-9]/g, '');
  return /^01\d{9}$/.test(digits) ? '88' + digits : digits;
}
