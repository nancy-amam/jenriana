import Booking from "@/models/bookings";

export async function generateBookingCode(): Promise<string> {
  let code: string;
  let exists = true;

  do {
    const randomNum = Math.floor(100000 + Math.random() * 900000); // 6 digits
    code = `#JK${randomNum}`;
    exists = !!(await Booking.exists({ bookingCode: code })); // ✅ convert to boolean
  } while (exists);

  return code;
}
