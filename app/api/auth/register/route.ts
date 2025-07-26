import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import {createUser} from "@/app/api/auth/userFunctions";


export async function POST(req: NextRequest) {
  try {
    const { username, password, email } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }
    const newUser = await createUser({ username, password, email });

    return NextResponse.json(newUser, { status: 201 });

  } catch (error: any) {
    if (error.message === 'User already exists') {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 }); // 409 Conflict
    }

    console.error('User creation failed:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
} 