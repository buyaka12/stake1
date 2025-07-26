import { NextRequest, NextResponse } from 'next/server';
import {fetchUser, updateBalance} from "@/app/api/auth/userFunctions";

const HOUSE_EDGE = 0.01;

function combinations(n: number, k: number) {
  if (k > n) return 0;
  let res = 1;
  for (let i = 1; i <= k; i++) {
    res *= (n - i + 1) / i;
  }
  return res;
}

export async function POST(req: NextRequest) {

  const userPayloadString = req.headers.get('x-user-payload');
  if (!userPayloadString) {
    return NextResponse.json({ error: 'User payload not found in request' }, { status: 401 });
  }
  const { username } = JSON.parse(userPayloadString);

  const { betAmount, numberOfMines, revealedTiles, minePositions } = await req.json();
  if (!betAmount || !numberOfMines || !username || !Array.isArray(revealedTiles) || !Array.isArray(minePositions)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (betAmount <= 0) {
    return NextResponse.json({ error: 'Cannot make a bet below 0' }, { status: 400 })
  }

  const user = await fetchUser(username);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // Use provided mine positions
  const totalTiles = 25;
  // Check if user hit a mine
  const hitMine = revealedTiles.some((tile: number) => minePositions.includes(tile));
  let payout = 0;
  let win = false;
  if (!hitMine) {
    const safePicks = revealedTiles.length;
    const multiplier = combinations(totalTiles - numberOfMines, safePicks) / combinations(totalTiles, safePicks);
    payout = betAmount * (1 / multiplier) * (1 - HOUSE_EDGE);
    win = true;
  }
  // Only add payout (bet was already deducted)
  const newBalance = user.wallet.balance + payout;
  await updateBalance(username, newBalance);
  return NextResponse.json({ win, payout, newBalance, minePositions });
} 