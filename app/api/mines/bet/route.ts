import { NextRequest, NextResponse } from 'next/server';
import {fetchUser, updateBalance} from "@/app/api/auth/userFunctions";

export async function POST(req: NextRequest) {

  const userPayloadString = req.headers.get('x-user-payload');
  if (!userPayloadString) {
    return NextResponse.json({ error: 'User payload not found in request' }, { status: 401 });
  }

  const { username } = JSON.parse(userPayloadString);

  const { betAmount } = await req.json();
  if (!betAmount || !username) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (betAmount <= 0) {
    return NextResponse.json({ error: 'Cannot make a bet below 0' }, { status: 400 })
  }

  const user = await fetchUser(username);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  if (user.wallet.balance < betAmount) return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });

  const newBalance = user.wallet.balance - betAmount;
  await updateBalance(username, newBalance);
  return NextResponse.json({ newBalance });
} 