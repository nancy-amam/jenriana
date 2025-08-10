import { getUserFromRequest } from '../../lib/getUserFromRequest';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getUserFromRequest();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json({ message: 'Welcome admin!' });
}
