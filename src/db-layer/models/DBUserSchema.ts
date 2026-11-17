import { Schema } from 'mongoose';

export const DBUserSchema = new Schema(
  {
    phone_no: { type: String, required: true },
    pass: { type: String, required: true },
    status: { type: Boolean, default: true },
    ref_id: {
      type: Schema.Types.ObjectId,
      ref: 'userDetails',
    },
  },
  {
    timestamps: true,
  }
);

export const DBUserDetailsSchema = new Schema(
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



