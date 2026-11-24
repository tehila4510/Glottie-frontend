import { API_BASE_URL as BASE_URL } from '../../../app/config';

export async function askChatTeacher(message, history, token) {
  const res = await fetch(`${BASE_URL}/Chat/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ message, history }),
  });

  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }

  return await res.json(); 
}