import mongoose, { Document, Schema, Model } from "mongoose";
import { ReusableProdModel, ReusableProductModel } from "@/utils/interface";

export interface IProductStockDocument extends ReusableProdModel, Document {
    stock: number,
    measurement: string,
}

const stockProductSchema: Schema<IProductStockDocument> = new Schema<IProductStockDocument>({
    stock: { type: Number },
    measurement: {type: String},
    ...ReusableProductModel
})

let ProductStockModel: Model<IProductStockDocument>;

try {
    ProductStockModel = mongoose.model<IProductStockDocument>("productstock");
} catch (error) {
    ProductStockModel = mongoose.model<IProductStockDocument>("productstock", stockProductSchema);
}

export default ProductStockModel;
