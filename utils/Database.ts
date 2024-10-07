import mongoose from "mongoose";

const mongoURL: string | any = process.env.NEXT_PUBLIC_MONGO_ATLAS_URL;

const connectMongo = async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log("the server is running on port 3000")
  } catch (error) {
    console.log("Connection failed!", error);
  }
}

export default connectMongo;