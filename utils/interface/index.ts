import { ObjectId } from "mongodb";
import { Document } from "mongoose";

export interface productInterface {
    name: String;
    cost: Number;
    discount: Number;
    image: String;
    about: String;
}

export interface productOnlyInterface {
    stockData: any;
    _id: ObjectId;
    name: string;
    cost: number;
    discount: number;
    image: string;
    about: string;
    category?: string;
    stock?:number;
    measurement?: string;
    created_at: Date;
    updated_at: Date;
}

export interface productListingInterface {
    [key: string]: {
        slug: string;
        title: string;
        products: [productOnlyInterface]
    }
}

export interface ReusableTime extends Document {
    created_at: Date;
    updated_at: Date;
}

export const ReusableTimeModel = {
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
} 

export interface ReusableModel extends ReusableTime, Document {
    userId: ObjectId;
}

export const ReusableUserModel = {
    userId: ObjectId,
    ...ReusableTimeModel
};

export interface ReusableProdModel extends ReusableTime, Document {
    productId: ObjectId;
}

export const ReusableProductModel = {
    productId: ObjectId,
    ...ReusableTimeModel
};

export interface useAuthInterface {
    created_at: string
    email: string
    password: string
    role: string
    updated_at: string
    __v: number
    _id: string
}

export interface CartItemInterface {
    stockData: any;
    _id: string;
    productId: string;
    productCount: number;
    status: string;
    userId: string;
    created_at: string;
    updated_at: string;
    stock: number;
    totalPrice: number;
    productDetails:any;
    image: string;
    name: string;
    cost: number;
    discount: number;
    category: string;
    measurement: string;
}
