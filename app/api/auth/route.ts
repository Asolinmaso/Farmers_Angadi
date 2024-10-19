import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/models/user";
import connectMongo from "@/utils/Database"; // Ensure this file connects to MongoDB

export async function POST(req: NextRequest) {
  try {
    const { email, password, confirmPassword, role,username } = await req.json();

    // Check for missing fields
    if (!email || !password || !confirmPassword || !role || !username) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
    }

    await connectMongo(); // Connect to the database

    // Check if the user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = new User({
      username:username,
      email: email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
    });

    // Save the new user in the database
    await newUser.save();

    // Respond with a success message
    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error during registration: ", error.message);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
