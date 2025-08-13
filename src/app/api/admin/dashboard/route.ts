import { getUserFromRequest } from '../../lib/getUserFromRequest';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../lib/mongodb';

export async function GET() {
  const user = await getUserFromRequest();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json({ message: 'Welcome admin!' });
}

// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();
//     const user = await getUserFromRequest();
//     if (!user || user.role !== 'admin') {
//       return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
//     }

//     const bookings = await Booking.find()
//       .populate('user', 'fullname email')
//       .populate('apartment', 'name location pricePerNight');

//     return NextResponse.json({ bookings }, { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ message: 'Server Error' }, { status: 500 });
//   }
// }
