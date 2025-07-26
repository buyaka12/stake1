import { NextRequest, NextResponse } from 'next/server';
import {fetchUser, updateBalance} from "@/app/api/auth/userFunctions";

const HOUSE_EDGE = 0.01;

function generateRandomMultiplier(): number {
  const random = Math.random();
  const multiplier = 1 / (1 - random);
  return Math.max(1, Math.floor(multiplier * 100) / 100);
}

export async function POST(req: NextRequest) {


  const userPayloadString = req.headers.get('x-user-payload');
  if (!userPayloadString) {
    return NextResponse.json({ error: 'User payload not found in request' }, { status: 401 });
  }
  const { username } = JSON.parse(userPayloadString);
  const { betAmount, targetMultiplier } = await req.json();

  if (betAmount <= 0) {
    return NextResponse.json({ error: 'Cannot make a bet below 0' }, { status: 400 })
  }
  if (!betAmount || !targetMultiplier || !username) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const user = await fetchUser(username);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  if (user.wallet.balance < betAmount) return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });

  // Generate random multiplier
  const randomMultiplier = generateRandomMultiplier();
  const win = randomMultiplier >= targetMultiplier;
  const multiplier = targetMultiplier * (1 - HOUSE_EDGE);
  const payout     = win ? betAmount * multiplier : 0;
  const newBalance = (user.wallet.balance - betAmount) + payout;
  await updateBalance(username, newBalance);
  return NextResponse.json({ randomMultiplier, win, payout, newBalance });
} 