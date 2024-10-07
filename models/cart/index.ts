import mongoose, { Document, Schema, Model } from "mongoose";
import { ReusableProdModel, ReusableProductModel } from "@/utils/interface";
import { ObjectId } from "mongodb";

export interface IcartDocument extends ReusableProdModel, Document {
    productCount: number,
    status: string,
    userId: ObjectId
}

const cartSchema: Schema<IcartDocument> = new Schema<IcartDocument>({
    ...ReusableProductModel,
    productCount: {
        type: Number,
    },
    status: {
        type: String,
    },
    userId: ObjectId
})

let CartModel: Model<IcartDocument>;

try {
    CartModel = mongoose.model<IcartDocument>("cart");
} catch (error) {
    CartModel = mongoose.model<IcartDocument>("cart", cartSchema);
}

export default CartModel;
