import connectMongo from "@/utils/Database";
import ProductModel from "@/models/product";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Initialize the S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,  // Ensure to set AWS_REGION in your .env file
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function uploadFileToS3(file: File) {
  const fileExtension = path.extname(file.name);
  const uniqueFileName = `${uuidv4()}${fileExtension}`;

  // Set up the S3 upload parameters
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME, // Ensure to set this in your .env file
    Key: uniqueFileName,
    Body: Buffer.from(await file.arrayBuffer()), // Convert file to buffer
    ContentType: file.type, // Set correct MIME type
  };

  try {
    // Uploading the file to S3
    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Construct and return the S3 URL
    return `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Error uploading file");
  }
}

export async function POST(req: Request) {
  try {
    // Connect to the database
    await connectMongo();

    // Parse the form data from the request
    const formData = await req.formData();
    
    // Extract fields from the formData
    const name = formData.get("name") as string;
    const cost = parseFloat(formData.get("cost") as string);
    const discount = parseFloat(formData.get("discount") as string) || 0;
    const about = formData.get("about") as string;
    const category = formData.get("category") as string || "Uncategorized";

    // Handle the file upload
    const imageFile = formData.get("image") as File;
    
    if (!imageFile) {
      return NextResponse.json({ message: "No image file uploaded" }, { status: 400 });
    }

    // Upload the file to S3 and get the URL
    const imageUrl = await uploadFileToS3(imageFile);

    // Create a new product
    const newProduct = new ProductModel({
      name,
      cost,
      discount,
      image: imageUrl, // Save the S3 image URL
      about,
      category,
    });

    // Save the product in the database
    await newProduct.save();

    // Return success response
    return NextResponse.json({ message: "Product created successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Error saving product: ", error);
    return NextResponse.json({ message: "Error saving product" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectMongo();
    
    // Extract the search query from the request URL
    const { searchParams } = new URL(req.url);
    const productName = searchParams.get("productName");

    let products;
    
    // If a productName query exists, filter the products by name
    if (productName) {
      const regex = new RegExp(productName, 'i'); // 'i' makes it case-insensitive
      products = await ProductModel.find({ name: { $regex: regex } });
    } else {
      // If no productName query, return all products
      products = await ProductModel.find({});
    }
    
    return NextResponse.json({ data: products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products: ", error);
    return NextResponse.json({ message: "Error fetching products" }, { status: 500 });
  }
}
