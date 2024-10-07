import mongoose, { Document, Schema, Model } from "mongoose";
import { ReusableTime, ReusableTimeModel } from "@/utils/interface";

export interface IUsersDocument extends ReusableTime, Document {
    username: string,
    email: string,
    password: string,
    picture: string,
    otp: string,
    role: string,
}

const BasicProfileSchema: Schema<IUsersDocument> = new Schema<IUsersDocument>({
    username: { type: String },
    email: { type: String },
    password: { type: String },
    picture: { type: String },
    otp: { type: String },
    role: { type: String, default: "Producers" },
    ...ReusableTimeModel
})

let MinimumUsertModel: Model<IUsersDocument>;

try {
    MinimumUsertModel = mongoose.model<IUsersDocument>("minimumuserdata");
} catch (error) {
    MinimumUsertModel = mongoose.model<IUsersDocument>("minimumuserdata", BasicProfileSchema);
}

export default MinimumUsertModel;
