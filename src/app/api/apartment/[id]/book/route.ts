/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUserFromRequest } from "@/app/api/lib/getUserFromRequest";
import connectDB from "@/app/api/lib/mongodb";
import Apartment from "@/models/apartment";
import Booking from "@/models/bookings";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();

    const { id } = await params;
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse JSON body
    const {
      checkInDate,
      checkOutDate,
      guests,
      paymentMethod,
      addons,
      customerName,
      customerEmail,
      customerPhone,
      specialRequest,
      residentialAddress,
    } = await req.json();

    // Validate required fields
    if (
      !checkInDate ||
      !checkOutDate ||
      !guests ||
      !paymentMethod ||
      !customerName ||
      !customerEmail ||
      !customerPhone
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email and phone formats
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }
    if (!/^\+?\d{10,14}$/.test(customerPhone.replace(/\s/g, ""))) {
      return NextResponse.json(
        { message: "Invalid phone number" },
        { status: 400 }
      );
    }

    // Validate payment method
    if (!["card", "bank"].includes(paymentMethod)) {
      return NextResponse.json(
        { message: "Invalid payment method" },
        { status: 400 }
      );
    }

    // Fetch apartment
    const apartment = await Apartment.findById(id);
    if (!apartment) {
      return NextResponse.json(
        { message: "Apartment not found" },
        { status: 404 }
      );
    }

    // Calculate stay duration
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const days = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (isNaN(days) || days <= 0) {
      return NextResponse.json(
        { message: "Invalid check-in/check-out dates" },
        { status: 400 }
      );
    }

    // 🔎 Check for confirmed overlapping bookings
    const overlappingBooking = await Booking.findOne({
      apartmentId: id,
      status: "confirmed", // ✅ only check confirmed bookings
      $or: [
        {
          checkInDate: { $lt: checkOut },
          checkOutDate: { $gt: checkIn },
        },
      ],
    });

    if (overlappingBooking) {
      return NextResponse.json(
        {
          message:
            "This apartment is already booked for the selected period. Please choose different dates.",
        },
        { status: 409 }
      );
    }

    // Base cost
    const baseCost = days * apartment.pricePerNight;

    // Validate and process addons
    const addonsDetails: any[] = [];
    let addonsTotal = 0;
    if (addons?.length) {
      for (const addonId of addons) {
        const addon = apartment.addons.find(
          (a: any) => a?._id?.toString() === addonId
        );
        if (!addon) {
          return NextResponse.json(
            {
              message: `Invalid addon: ${addonId} does not belong to this apartment`,
            },
            { status: 400 }
          );
        }
        if (!addon.active) {
          return NextResponse.json(
            { message: `Addon ${addon.name} is not active` },
            { status: 400 }
          );
        }
        const total =
          addon.pricingType === "perNight"
            ? addon.price * days
            : addon.price;
        addonsTotal += total;
        addonsDetails.push({
          _id: addon._id,
          name: addon.name,
          price: addon.price,
          pricingType: addon.pricingType,
          total,
        });
      }
    }

    // Charges
    const subtotal = baseCost + addonsTotal;
    const serviceCharge = subtotal * 0.05;
    const tax = subtotal * 0.1;
    const totalAmount = subtotal + serviceCharge + tax;

    // Create booking (still pending until payment confirmation)
    const booking = await Booking.create({
      userId: user._id,
      apartmentId: id,
      checkInDate,
      checkOutDate,
      guests,
      paymentMethod,
      addons: addonsDetails,
      serviceCharge,
      tax,
      totalAmount,
      status: "pending", // stays pending until confirmed
      customerName,
      customerEmail,
      customerPhone,
      residentialAddress,
      specialRequest,
    });

    return NextResponse.json(
      {
        message: "Booking created. Proceed to checkout.",
        booking,
        bookingId: booking._id.toString(),
        totalAmount,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
