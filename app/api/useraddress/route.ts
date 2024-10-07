import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/utils/Database";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
    try {

    } catch (err) {
        console.error("err", err);
        return NextResponse.json({ message: "something went wrong", status: 500 }); 
    }
}

export async function GET(req: NextRequest) {

    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const userId = searchParams.get("userId");

    try {

    } catch (err) {
        console.error("err", err);
        return NextResponse.json({ message: "something went wrong", status: 500 }); 
    }

}

export async function PUT(req: NextRequest) {

    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const userId = searchParams.get("userId");

    try {

    } catch (err) {
        console.error("err", err);
        return NextResponse.json({ message: "something went wrong", status: 500 }); 
    }

}

export async function DELETE(req: NextRequest) {

    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const userId = searchParams.get("userId");

    try {

    } catch (err) {
        console.error("err", err);
        return NextResponse.json({ message: "something went wrong", status: 500 }); 
    }

}
