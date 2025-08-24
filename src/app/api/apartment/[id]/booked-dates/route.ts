import Booking from '@/models/bookings'; // Adjust path
import { NextRequest, NextResponse } from 'next/server';

interface RouteContext {
  params: Promise<{ id: string }>;
}
export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const bookings = await Booking.find(
      { apartmentId: id, status: 'confirmed' }, // Only confirmed bookings
      { checkInDate: 1, checkOutDate: 1 }
    ).lean();

    const bookedDates = bookings.flatMap(booking => {
      const dates = [];
      const currentDate = new Date(booking.checkInDate);
      const endDate = new Date(booking.checkOutDate);
      while (currentDate <= endDate) {
        dates.push(new Date(currentDate).toISOString().split('T')[0]); // YYYY-MM-DD
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dates;
    });

    return NextResponse.json({ bookedDates }, { status: 200 });
  } catch (error) {
    console.error('Error fetching booked dates:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}