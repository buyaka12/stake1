import { NextRequest, NextResponse } from 'next/server';
import {fetchUser, updateBalance} from "@/app/api/auth/userFunctions";

const HOUSE_EDGE = 0.01;


export async function POST(req: NextRequest) {

  const userPayloadString = req.headers.get('x-user-payload');
  if (!userPayloadString) {
    return NextResponse.json({ error: 'User payload not found in request' }, { status: 401 });
  }

  const { username } = JSON.parse(userPayloadString);
  const { betAmount, target } = await req.json();
  if (!betAmount || !target || !username) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (betAmount <= 0) {
    return NextResponse.json({ error: 'Cannot make a bet below 0' }, { status: 400 })
  }

  const user = await fetchUser(username);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  if (user.wallet.balance < betAmount) return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });

  // Roll
  const roll = Math.floor(Math.random() * 100) + 1;
  const win = roll > target;
  const chance = target;
  const multiplier = (99 / chance) * (1 - HOUSE_EDGE);
  const payout = win ? betAmount * multiplier : 0;
  const newBalance = user.wallet.balance - betAmount + payout;
  await updateBalance(username, newBalance);
  return NextResponse.json({ roll, win, payout, newBalance });
} 