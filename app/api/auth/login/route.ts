import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {fetchUser} from "@/app/api/auth/userFunctions";

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
  }

  const user = await fetchUser(username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '7d' });

  return NextResponse.json({ token });
}