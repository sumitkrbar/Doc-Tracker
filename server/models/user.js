import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password:{
        type: String,
        required: true,
  },
  // storing reference to documents also if needed
  documents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document"
    }
  ],
  otp: {
    type: String,
    default: null
  },
  otpExpiry: {
    type: Date,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  adminPin: {
    type: String, // hashed pin for admin access
    default: null
  },
  isAdminPinSet: {
    type: Boolean,
    default: false
  },
  adminPinUpdatedAt: {
    type: Date,
    default: null
  },
  adminOtp: {
    type: String, // hashed otp for admin pin set/reset
    default: null
  },
  adminOtpExpiry: {
    type: Date,
    default: null
  }

},{timestamps: true});

export default mongoose.model("User", userSchema);
