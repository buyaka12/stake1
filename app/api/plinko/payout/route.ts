// app/api/plinko/payout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import {fetchUser, updateBalance} from "@/app/api/auth/userFunctions";

export async function POST(req: NextRequest) {

  const userPayloadString = req.headers.get('x-user-payload');
  if (!userPayloadString) {
    return NextResponse.json({ error: 'User payload not found in request' }, { status: 401 });
  }
  const { username } = JSON.parse(userPayloadString);

  const { betAmount, payoutMultiplier } = await req.json()
  if (
    typeof username !== 'string' ||
    typeof betAmount !== 'number' ||
    typeof payoutMultiplier !== 'number'
  ) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const user = await fetchUser(username)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // Compute payout and credit
  const payout = betAmount * payoutMultiplier
  const newAmount = user.wallet.balance += payout
  await updateBalance(username, newAmount);

  return NextResponse.json({
    payout,
    newBalance: user.wallet.balance,
  })
}
