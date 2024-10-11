import mongoose from "mongoose";

const mongoURL: string = process.env.NEXT_PUBLIC_MONGO_ATLAS_URL || "";

let isConnected: boolean = false;

const connectMongo = async () => {
  if (isConnected) {
    console.log("Reusing existing MongoDB connection");
    return;
  }

  try {
    await mongoose.connect(mongoURL);
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    isConnected = false;
  }
};

export default connectMongo;
