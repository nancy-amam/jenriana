import { getUserFromRequest } from '../../lib/getUserFromRequest';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getUserFromRequest();
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  return NextResponse.json({ user });
}
