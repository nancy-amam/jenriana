import { getUserFromRequest } from '../../lib/getUserFromRequest';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../lib/mongodb';

export async function GET() {
  await connectDB()
  const user = await getUserFromRequest();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json({ message: 'Welcome admin!' });
}

