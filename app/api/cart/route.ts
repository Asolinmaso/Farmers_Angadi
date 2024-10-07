import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import CartModel from "@/models/cart";
import ProductStockSchema from "@/models/product/stock";
import { JWT, getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.search);
  const productId = searchParams.get("productId");
  const canProductBeAdded = searchParams.get("canProductBeAdded");
  const token: JWT = (await getToken({ req }))!;
  const userId = token?.userId as string;

  if (!productId || !userId) {
    return NextResponse.json({ message: "Required parameters missing" });
  }

  const body = await req.json();

  if (!Object.keys(body).length) {
    return NextResponse.json(
      { message: "Empty request body" },
      { status: 201 }
    );
  }

  const { productCount, status } = body;

  if (!productCount || !status) {
    return NextResponse.json(
      { message: "Some body values are missing" },
      { status: 201 }
    );
  }

  const canBeReplaced = canProductBeAdded == "true" ? true : false;

  try {
    const stockCheck = await ProductStockSchema.findOne({
      productId,
    });

    if (!stockCheck) {
      return NextResponse.json(
        { message: "Stock is currently not available" },
        { status: 201 }
      );
    }

    if (stockCheck.stock < productCount) {
      return NextResponse.json(
        { message: "The product is currently low on stock" },
        { status: 201 }
      );
    }

    const isProductAlreadyPresent = await CartModel.findOne({
      productId,
      userId,
      status,
    });

    if (stockCheck.stock < productCount) {
      return NextResponse.json(
        { message: "Stock is not available" },
        { status: 200 }
      );
    }

    if (isProductAlreadyPresent) {
      await CartModel.findOneAndUpdate(
        { productId, status, userId },
        {
          productCount: canBeReplaced
            ? productCount
            : isProductAlreadyPresent.productCount + productCount,
        },
        { new: true }
      );
    } else {
      const newProductToCart = new CartModel({
        productId,
        userId,
        status,
        productCount,
      });

      await newProductToCart.save();
    }
    if (status !== "CART") {
      await ProductStockSchema.findOneAndUpdate(
        { productId },
        { stock: stockCheck.stock - productCount },
        { new: true }
      );
    }

    return NextResponse.json(
      { message: "Added to cart successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("err", err);
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const token: JWT = (await getToken({ req }))!;
  const userId = token?.userId as string;

  if (!userId) {
    return NextResponse.json({ message: "Required parameters missing" });
  }

  try {
    const aggregateArray = [
      {
        $match: {
          userId: new ObjectId(userId),
          status: "CART",
        },
      },
      {
        $project: {
          __v: 0,
        },
      },
      {
        $lookup: {
          from: "productdatas",
          localField: "productId",
          foreignField: "_id",
          as: "cart",
        },
      },
      {
        $lookup: {
          from: "productstocks",
          localField: "productId",
          foreignField: "productId",
          as: "stock",
        },
      },
      {
        $unwind: {
          path: "$stock",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$cart",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          totalPrice: {
            $multiply: [
              "$productCount",
              {
                $subtract: [1, "$cart.discount"],
              },
              "$cart.cost",
            ],
          },
          image: "$cart.image",
          name: "$cart.name",
          cost: "$cart.cost",
          discount: "$cart.discount",
          category: "$cart.category",
          stock: "$stock.stock",
          measurement: "$stock.measurement",
        },
      },
      {
        $project: {
          _id: 1,
          productId: 1,
          productCount: 1,
          status: 1,
          userId: 1,
          created_at: 1,
          updated_at: 1,
          totalPrice: 1,
          image: 1,
          name: 1,
          cost: 1,
          discount: 1,
          category: 1,
          stock: 1,
          measurement: 1,
        },
      },
    ];

    const givenUsersCartData = await CartModel.aggregate(aggregateArray);

    if (!givenUsersCartData.length) {
      return NextResponse.json({ data: [], message: "Cart is empty" });
    }

    return NextResponse.json({
      message: "list of cart saved products",
      data: givenUsersCartData,
    });
  } catch (err) {
    console.error("err", err);
    return NextResponse.json({ message: "something went wrong", status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.search);
  const token: JWT = (await getToken({ req }))!;
  const userId = token?.userId as string;
  const productId = searchParams.get("productId");

  try {
  } catch (err) {
    console.error("err", err);
    return NextResponse.json({ message: "something went wrong", status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.search);
  const token: JWT = (await getToken({ req }))!;
  const userId = token?.userId as string;
  const productId = searchParams.get("productId");

  if (!productId || !userId) {
    return NextResponse.json({ message: "Required parameters missing" });
  }

  try {
    const body = {
      productId,
      userId,
      status: "CART",
    };

    const isProductAlreadyPresent = await CartModel.findOne(body);

    if (isProductAlreadyPresent) {
      const toDeleteCartData = await CartModel.findOneAndDelete(body);
      if (toDeleteCartData) {
        return NextResponse.json(
          { message: "Deleted successfully" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Data was not deleted" },
          { status: 201 }
        );
      }
    } else {
      return NextResponse.json(
        { message: "Data is not available" },
        { status: 201 }
      );
    }
  } catch (err) {
    console.error("err", err);
    return NextResponse.json({ message: "something went wrong", status: 500 });
  }
}
