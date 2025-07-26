import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';

if (!JWT_SECRET) {
  throw new Error('Missing environment variable: JWT_SECRET');
}

const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('auth')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, secretKey);
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-payload', JSON.stringify(payload));
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (err) {
    return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
  }
}

export const config = {
  matcher: ['/api/dice/:path*', '/api/limbo/:path*', '/api/mines/:path*', '/api/plinko/:path*'],
};