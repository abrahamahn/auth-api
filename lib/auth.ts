import { NextApiRequest, NextApiResponse } from 'next';

export async function signUp(email: string, password: string) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  return data;
}
