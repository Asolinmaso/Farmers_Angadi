// app/api/cart/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/utils/Database";
import CartModel from "@/models/cart";
import mongoose from "mongoose";

// Define dynamic response based on request method
export async function GET(req: NextRequest) {
  return getCartItems(req);
}

export async function POST(req: NextRequest) {
  return addToCart(req);
}

export async function PUT(req: NextRequest) {
  return updateCart(req);
}

export async function DELETE(req: NextRequest) {
  return deleteCartItem(req);
}

// Fetch cart items
async function getCartItems(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
  
    await connectMongo();
    
    try {
      // Ensure userId is converted to ObjectId
      const objectIdUserId = new mongoose.Types.ObjectId(userId);
  
      // Query to fetch cart items for the user, along with product and stock data
      const cartItems = await CartModel.aggregate([
        {
          $match: { userId: objectIdUserId } // Match using ObjectId
        },
        {
          $lookup: {
            from: "products", // Assuming the collection name is 'products'
            localField: "productId",
            foreignField: "_id",
            as: "productDetails"
          }
        },
        {
          $unwind: "$productDetails" // Unwind the array to return one product per cart item
        },
        {
          $lookup: {
            from: "productstocks", // Assuming the collection name is 'productstocks'
            localField: "productDetails._id",
            foreignField: "productId",
            as: "stockData"
          }
        },
        {
          $unwind: {
            path: "$stockData",
            preserveNullAndEmptyArrays: true // Return products even if no stock data is found
          }
        }
      ]);
  
      // Return the fetched cart items
      return NextResponse.json({ items: cartItems });
    } catch (error) {
      console.error("Error fetching cart items:", error);
      return NextResponse.json({ error: "Failed to fetch cart items" }, { status: 500 });
    }
  }
  
// Add item to cart or increment if already exists
async function addToCart(req: NextRequest) {
  await connectMongo();
  try {
    const body = await req.json();
    const { productId, productCount, userId } = body;

    // Ensure userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Check if the product already exists in the user's cart
    const existingCartItem = await CartModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      productId: new mongoose.Types.ObjectId(productId),
      status: "CART", // Only look for items that are currently in "CART" status
    });

    if (existingCartItem) {
      // If the product exists, increment the product count
      existingCartItem.productCount += productCount;
      await existingCartItem.save();
      return NextResponse.json(existingCartItem);
    } else {
      // If it doesn't exist, create a new cart item with status "CART"
      const newCartItem = new CartModel({
        productId,
        productCount,
        userId: new mongoose.Types.ObjectId(userId),
        status: "CART",
      });

      await newCartItem.save();
      return NextResponse.json(newCartItem);
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 });
  }
}


// Update cart item
async function updateCart(req: NextRequest) {
    await connectMongo();
    try {
      const body = await req.json(); // Parse the request body
      const { cartId, productCount } = body;
  
      const updatedCart = await CartModel.findByIdAndUpdate(
        cartId,
        { productCount },
        { new: true }
      );
      return NextResponse.json(updatedCart);
    } catch (error) {
      return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 });
    }
  }

// Delete cart item
async function deleteCartItem(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cartId = searchParams.get("cartId");

  await connectMongo();
  try {
    await CartModel.findByIdAndDelete(cartId);
    return NextResponse.json({ message: "Item deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete cart item" }, { status: 500 });
  }
}
