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
    dor: { // date of registration
        type: Date,
        default: null
    },
    chasisNumber:{
        type: String,
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
    dir: { // documents in record
        type: [String],  
        default: []   
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }


},{timestamps: true});
export default mongoose.model("Document", documentSchema);
