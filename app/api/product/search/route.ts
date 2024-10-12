import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/utils/Database";
import ProductModel from "@/models/product"; // Assuming you have a product model

// Fetch products that match a partial product name
export async function GET(req: NextRequest) {
  try {
    await connectMongo();

    const url = new URL(req.url);
    const productName = url.searchParams.get("productName");
console.log(productName,"se");

    if (!productName) {
      return NextResponse.json({ data: [] }, { status: 400, statusText: "Product name is required." });
    }

    // Use regex for partial matching on product name
    const products = await ProductModel.aggregate([
      {
        $match: {
          name: { $regex: productName, $options: "i" }, // 'i' for case-insensitive matching
        },
      },
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
    ]);

    return NextResponse.json({ data: products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products: ", error);
    return NextResponse.json({ message: "Error fetching products" }, { status: 500 });
  }
}
