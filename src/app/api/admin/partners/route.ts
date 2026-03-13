/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import Apartment from "@/models/apartment";
import Booking from "@/models/bookings";
import mongoose from "mongoose";
import connectDB from "../../lib/mongodb";
import { getUserFromRequest } from "../../lib/getUserFromRequest";
import bcrypt from "bcrypt";

const COMMISSION_RATE = 0.1; // 10%

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const admin = await getUserFromRequest();
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const partners = await User.find({ role: "partner" })
      .select("firstName lastName email phone createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const partnerIds = partners.map((p) => p._id);

    const apartmentsByOwner = await Apartment.find({
      ownerId: { $in: partnerIds },
    })
      .select("_id ownerId")
      .lean();

    const apartmentIdsByPartner = new Map<string, mongoose.Types.ObjectId[]>();
    for (const apt of apartmentsByOwner) {
      if (!apt.ownerId) continue;
      const id = (apt.ownerId as mongoose.Types.ObjectId).toString();
      if (!apartmentIdsByPartner.has(id)) {
        apartmentIdsByPartner.set(id, []);
      }
      apartmentIdsByPartner.get(id)!.push(apt._id as mongoose.Types.ObjectId);
    }

    const allOwnerApartmentIds = apartmentsByOwner.map((a) => a._id);

    const bookings = await Booking.find({
      apartmentId: { $in: allOwnerApartmentIds },
      status: "confirmed",
    })
      .select("apartmentId totalAmount partnerPayoutStatus partnerPaidAt")
      .lean();

    const apartmentToOwner = new Map<string, string>();
    for (const apt of apartmentsByOwner) {
      if (apt.ownerId) {
        apartmentToOwner.set((apt._id as mongoose.Types.ObjectId).toString(), (apt.ownerId as mongoose.Types.ObjectId).toString());
      }
    }

    const earningsByPartner = new Map<
      string,
      { totalEarnings: number; totalPaid: number; totalPending: number }
    >();

    for (const b of bookings) {
      const aptId = (b.apartmentId as mongoose.Types.ObjectId).toString();
      const ownerId = apartmentToOwner.get(aptId);
      if (!ownerId) continue;

      const commission = (b.totalAmount ?? 0) * COMMISSION_RATE;
      const net = (b.totalAmount ?? 0) - commission;

      if (!earningsByPartner.has(ownerId)) {
        earningsByPartner.set(ownerId, {
          totalEarnings: 0,
          totalPaid: 0,
          totalPending: 0,
        });
      }
      const stats = earningsByPartner.get(ownerId)!;
      stats.totalEarnings += net;
      if (b.partnerPayoutStatus === "paid") {
        stats.totalPaid += net;
      } else {
        stats.totalPending += net;
      }
    }

    const list = partners.map((p) => {
      const id = (p._id as mongoose.Types.ObjectId).toString();
      const fullname = [p.firstName, p.lastName].filter(Boolean).join(" ").trim() || p.email;
      const stats = earningsByPartner.get(id) ?? {
        totalEarnings: 0,
        totalPaid: 0,
        totalPending: 0,
      };
      return {
        _id: id,
        fullname,
        firstName: p.firstName,
        lastName: p.lastName,
        email: p.email,
        phone: p.phone ?? "",
        createdAt: p.createdAt,
        totalEarnings: Math.round(stats.totalEarnings),
        totalPaid: Math.round(stats.totalPaid),
        totalPending: Math.round(stats.totalPending),
      };
    });

    return NextResponse.json({
      message: "Partners fetched successfully",
      partners: list,
    });
  } catch (err) {
    console.error("Admin partners GET error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const admin = await getUserFromRequest();
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { email, firstName, lastName, phone, password } = body;

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { message: "A user with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = password?.trim()
      ? await bcrypt.hash(password.trim(), 10)
      : await bcrypt.hash("ChangeMe123!", 10);

    const newPartner = new User({
      email: email.trim().toLowerCase(),
      firstName: (firstName ?? "").trim() || email.split("@")[0],
      lastName: (lastName ?? "").trim(),
      phone: (phone ?? "").trim() || "—",
      password: hashedPassword,
      role: "partner",
    });

    await newPartner.save();

    const fullname = [newPartner.firstName, newPartner.lastName].filter(Boolean).join(" ").trim() || newPartner.email;
    return NextResponse.json(
      {
        message: "Partner created successfully",
        partner: {
          _id: newPartner._id,
          fullname,
          email: newPartner.email,
          phone: newPartner.phone,
          createdAt: newPartner.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Admin partners POST error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
