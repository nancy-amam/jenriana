/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import connectDB from '../lib/mongodb';
import Apartment from "@/models/apartment";
import { pinFileToPinata } from "../lib/pinata";

// GET all apartments
export async function GET() {
  await connectDB();

  try {
    const apartments = await Apartment.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: apartments });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}


// export async function GET() {
//   await connectDB();

//   try {
//     const apartments = await Apartment.aggregate([
//       {
//         $lookup: {
//           from: 'feedbacks', // must match your actual collection name
//           localField: '_id',
//           foreignField: 'apartmentId',
//           as: 'feedbacks'
//         }
//       },
//       {
//         $addFields: {
//           averageRating: {
//             $cond: [
//               { $gt: [{ $size: '$feedbacks' }, 0] },
//               { $avg: '$feedbacks.rating' },
//               null
//             ]
//           },
//           feedbackCount: { $size: '$feedbacks' }
//         }
//       },
//       { $sort: { createdAt: -1 } }
//     ]);
//     const feedbacks = await Apartment.find().populate('feedbacks');
//     console.log(feedbacks)

//     return NextResponse.json({ success: true, data: apartments, feedbacks });
//   } catch (error: any) {
//     return NextResponse.json({ success: false, message: error.message }, { status: 500 });
//   }
// }

// CREATE new apartment
export async function POST(request: Request) {
  try {
    await connectDB();
    const formData = await request.formData();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = Number(formData.get('price'));
    const location = formData.get('location') as string;

    const galleryFiles = formData.getAll('gallery') as File[];
    const galleryUrls: string[] = [];

    for (const file of galleryFiles) {
      const url = await pinFileToPinata(file);
      galleryUrls.push(url);
    }

    const apartment = await Apartment.create({
      title,
      description,
      price,
      location,
      gallery: galleryUrls,
    });

    return NextResponse.json({ success: true, data: apartment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
