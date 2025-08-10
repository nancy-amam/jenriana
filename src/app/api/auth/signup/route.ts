import { NextResponse } from 'next/server';
import connectDB from '../../lib/mongodb';
import User from '@/models/user';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { fullname, email, phone, password, confirmPassword } = await request.json();

    if (!fullname || !email || !phone || !password || !confirmPassword) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Password confirmation check
    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: 'Passwords do not match' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      fullname,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          id: newUser._id,
          email: newUser.email,
          fullname: newUser.fullname,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
