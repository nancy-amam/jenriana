import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt';
import User from '@/models/user';
import connectDB from './mongodb';

export async function getUserFromRequest() {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) return null;

    await connectDB();
    const decoded = verifyToken(token) as { id: string; role: string};
    const user = await User.findById(decoded.id).select('-password');
    return user;
  } catch {
    return null;
  }
}
