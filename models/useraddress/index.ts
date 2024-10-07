import mongoose, { Document, Schema, Model } from "mongoose";
import { ReusableModel, ReusableUserModel } from "@/utils/interface";

export interface IUserAddressDocument extends ReusableModel, Document {
    doorNumber: string;
    contactInfo: string;
    street: string;
    village: string;
    city: string;
    state: string;
    country: string;
    pinNumber: number;
}

const userAddressSchema: Schema<IUserAddressDocument> =
    new Schema<IUserAddressDocument>({
        doorNumber: { type: String },
        contactInfo: { type: String },
        street: { type: String },
        village: {type: String},
        city: {type: String},
        state: {type: String},
        country: {type: String},
        pinNumber: {type: Number},
        ...ReusableUserModel
    });

    let UserAddressModel: Model<IUserAddressDocument>;

    try {
        UserAddressModel = mongoose.model<IUserAddressDocument>("userAddressData");
    } catch (error) {
        UserAddressModel = mongoose.model<IUserAddressDocument>("userAddressData", userAddressSchema);
    }
    
    export default UserAddressModel;
    