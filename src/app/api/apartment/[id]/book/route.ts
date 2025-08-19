/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUserFromRequest } from "@/app/api/lib/getUserFromRequest";
import connectDB from "@/app/api/lib/mongodb";
import Apartment from "@/models/apartment";
import { NextRequest, NextResponse } from "next/server";
import Booking from '@/models/bookings';


interface RouteContext {
  params: Promise<{ id: string }>
}
export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();

    const { id } = await params;
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    // ✅ Extract fields from FormData
    // const apartmentId = formData.get("apartmentId") as string;
    const checkInDate = formData.get("checkInDate") as string;
    const checkOutDate = formData.get("checkOutDate") as string;
    const guests = Number(formData.get("guests"));
    const paymentMethod = formData.get("paymentMethod") as "card" | "bank";
    const selectedAddons = formData.getAll("selectedAddons") as string[];

    // 👇 New user details from form
    const customerName = formData.get("customerName") as string;
    const customerEmail = formData.get("customerEmail") as string;
    const customerPhone = formData.get("customerPhone") as string;
    const specialRequest = formData.get("specialRequest") as string | null;

    if (
    //   !apartmentId ||
      !checkInDate ||
      !checkOutDate ||
      !guests ||
      !paymentMethod ||
      !customerName ||
      !customerEmail ||
      !customerPhone
    ) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    // Fetch apartment
    const apartment = await Apartment.findById(id);
    if (!apartment) {
      return NextResponse.json({ message: "Apartment not found" }, { status: 404 });
    }

    // Calculate stay duration
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const days = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (days <= 0) {
      return NextResponse.json({ message: "Invalid check-in/check-out dates" }, { status: 400 });
    }

    // Base cost
    const baseCost = days * apartment.pricePerNight;

    // Addons
    const addonsDetails: any[] = [];
    let addonsTotal = 0;
    for (const addonId of selectedAddons) {
      const addon = apartment.addons.find((a) => a?._id?.toString() === addonId);

  if (!addon) {
    return NextResponse.json(
      { message: `Invalid addon: ${addonId} does not belong to this apartment` },
      { status: 400 }
    );
  }
  if (!addon.active) {
    return NextResponse.json(
      { message: `Addon ${addon.name} is not active` },
      { status: 400 }
    );
  }

      if (!addon || !addon.active) continue;

      const total = addon.pricingType === "perNight" ? addon.price * days : addon.price;
      addonsTotal += total;
      addonsDetails.push({
        name: addon.name,
        price: addon.price,
        pricingType: addon.pricingType,
        total,
      });
    }

    // Charges
    const subtotal = baseCost + addonsTotal;
    const serviceCharge = subtotal * 0.05;
    const tax = subtotal * 0.1;
    const totalAmount = subtotal + serviceCharge + tax;

    // Create booking
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
      status: "pending",

      // ✅ Store user details
      customerName,
      customerEmail,
      customerPhone,
      specialRequest,
    });

    return NextResponse.json(
      {
        message: "Booking created. Proceed to checkout.",
        booking,
        bookingId: booking._id,
        totalAmount,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}