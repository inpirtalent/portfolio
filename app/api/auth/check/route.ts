import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('admin-auth');
  const isAuthenticated = authCookie?.value === 'authenticated';

  return NextResponse.json({ authenticated: isAuthenticated });
}

