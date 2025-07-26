import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import {fetchUser} from "@/app/api/auth/userFunctions";

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
  }
  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { username: string };
    const user = await fetchUser(payload.username);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create a JSON response
    const response = NextResponse.json({
      username: user.username,
      wallet: user.wallet,
      email: user.email,
    });

    // Set the cookie on the response
    response.cookies.set('auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    // Return the response with the cookie
    return response;

  } catch (error) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}
