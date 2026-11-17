import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUserDoc extends Document {
  phone_no: string;
  pass: string;
  status: boolean;
  ref_id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDetailsDoc extends Document {
  block: boolean;
  email?: string;
  DOB?: string;
  address?: {
    city?: string;
    district?: string;
    state?: string;
    country?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUserDoc>(
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

const userDetailsSchema = new Schema<IUserDetailsDoc>(
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

export const UserSchema: Model<IUserDoc> =
  (mongoose.models.user as Model<IUserDoc>) || mongoose.model<IUserDoc>('user', userSchema);

export const UserDetailsSchema: Model<IUserDetailsDoc> =
  (mongoose.models.userDetails as Model<IUserDetailsDoc>) ||
  mongoose.model<IUserDetailsDoc>('userDetails', userDetailsSchema);
