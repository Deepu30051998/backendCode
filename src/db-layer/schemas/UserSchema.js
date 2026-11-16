const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    phone_no: { type: String, required: true },
    pass: { type: String, required: true },
    status: { type: Boolean, default: true },
    ref_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userDetails",
    },
  },
  {
    timestamps: true,
  }
);

const userDetailsSchema = new mongoose.Schema(
  {
    block: { type: Boolean, default: false },
    email: { type: String },
    DOB: { type: String },
    address: {
      city: { type: String },
      district: { type: String },
      state: { type: String },
      country: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

const UserSchema = mongoose.models.user || mongoose.model("user", userSchema);
const UserDetailsSchema =
  mongoose.models.userDetails || mongoose.model("userDetails", userDetailsSchema);

module.exports = { UserSchema, UserDetailsSchema };

