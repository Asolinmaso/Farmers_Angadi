import { NextRequest, NextResponse } from 'next/server';
import connectMongo from "@/utils/Database";

import ProductStockSchema from "@/models/product/stock";

export async function PUT (req: NextRequest) {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const categoryId = searchParams.get("categoryId");

    if(!categoryId){
        return NextResponse.json({message: "required parameter is missing"})
    }

    connectMongo();

    const body = await req.json();

    if (!body) {
        return NextResponse.json({ message: "Empty request body" });
    }

    const {stock, measurement} = body;

    if(!stock || !measurement){
        return NextResponse.json({message: "Required data missing"})
    }

    try {

        const stockPresent = await ProductStockSchema.findOne({productId: categoryId})

        if(!stockPresent){
            const listStockData = new ProductStockSchema({
                stock,
                measurement,
                productId: categoryId
            })

            await listStockData.save()
        }else {
            await ProductStockSchema.findOneAndUpdate(
                {productId: categoryId}, 
                {stock, measurement, updated_at: new Date()}, 
                {new: true})
        }

        return NextResponse.json({message: "Stock updated successfully"})
    
    } catch (err) {
        console.log("err", err)
        return NextResponse.json({message: "Something went wrong", status: 500})
    } 
}
