// pages/api/product.ts

import { NextResponse } from 'next/server';
import connectMongo from "@/utils/Database";
import mongoose, { Types } from "mongoose"; // Import mongoose for session
import ProductModel from "@/models/product";
import ProductStockModel from "@/models/product/stock";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import path from "path";

// Initialize the S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Function to upload a file to S3
async function uploadFileToS3(file: File) {
  const fileExtension = path.extname(file.name);
  const uniqueFileName = `${uuidv4()}${fileExtension}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: uniqueFileName,
    Body: Buffer.from(await file.arrayBuffer()), // Convert file to buffer
    ContentType: file.type,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  return `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
}

export async function POST(req: Request) {
  // Connect to MongoDB
  await connectMongo();

  // Start a session for transactions
  const session = await mongoose.startSession();

  try {
    session.startTransaction(); // Start a transaction

    // Parse form data from the request
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const cost = parseFloat(formData.get("cost") as string);
    const discount = parseFloat(formData.get("discount") as string) || 0;
    const about = formData.get("about") as string;
    const category = formData.get("category") as string || "Uncategorized";
    const stock = parseInt(formData.get("stock") as string);
    const measurement = formData.get("measurement") as string || "Units";

    // Handle the image file
    const imageFile = formData.get("image") as File;
    if (!imageFile) {
      await session.abortTransaction();
      return NextResponse.json({ message: "No image file uploaded" }, { status: 400 });
    }

    // Upload the image to S3
    const imageUrl = await uploadFileToS3(imageFile);

    // Create a new product
    const newProduct = new ProductModel({
      name,
      cost,
      discount,
      image: imageUrl,
      about,
      category,
    });

    // Save the product in the database
    const savedProduct = await newProduct.save({ session });

    // Create the related stock entry using the productId from the saved product
    const newStock = new ProductStockModel({
      stock,
      measurement,
      productId: savedProduct._id, // Link the stock entry with the product's ID
    });

    // Save the stock data
    await newStock.save({ session });

    // Commit the transaction if both product and stock save successfully
    await session.commitTransaction();

    // Return success response
    return NextResponse.json({ message: "Product and stock created successfully!" }, { status: 201 });
  } catch (error) {
    // Rollback the transaction in case of any failure
    await session.abortTransaction();
    console.error("Error creating product with stock: ", error);
    return NextResponse.json({ message: "Error creating product with stock" }, { status: 500 });
  } finally {
    session.endSession(); // End the session
  }
}

import { NextRequest } from "next/server";


export async function GET(req: NextRequest) {
  try {
    await connectMongo();

    const url = new URL(req.url);
    const category = url.searchParams.get("category");
    const productId = url.searchParams.get("productId");

    // Create the aggregation pipeline with $lookup for stock data
    const aggregationPipeline = [
      // Filter by category if provided, or by productId if provided
      ...(productId ? [{ $match: { _id: new Types.ObjectId(productId) } }] : []),
      ...(category ? [{ $match: { category } }] : []),
      {
        $lookup: {
          from: "productstocks", // The collection for ProductStockModel
          localField: "_id",      // Field from ProductModel
          foreignField: "productId", // Field from ProductStockModel
          as: "stockData",        // Alias for the stock data
        },
      },
      {
        $unwind: {
          path: "$stockData",
          preserveNullAndEmptyArrays: true, // Ensures products with no stock data are still returned
        },
      },
    ];

    // Fetch products with stock data
    const products = await ProductModel.aggregate(aggregationPipeline);

    // Return the product if fetching by productId (return the first item)
    if (productId && products.length > 0) {
      return NextResponse.json({ data: products[0] }, { status: 200 });
    }

    return NextResponse.json({ data: products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products: ", error);
    return NextResponse.json({ message: "Error fetching products" }, { status: 500 });
  }
}
