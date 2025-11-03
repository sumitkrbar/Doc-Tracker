import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    owner : {
        type: String,
        required: true
    },
    phone:{
        type: Number,
    },
    vehicleNumber:{
        type: String,
        required: true,
    },
    cf:{
        type: Date,
    },
    np:{
        type: Date,
    },
    auth:{
        type: Date,
    },
    remarks:{
        type: String,
    },
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }


},{timestamps: true});
export default mongoose.model("Document", documentSchema);
