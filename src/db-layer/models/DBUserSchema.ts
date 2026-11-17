import { Schema } from 'mongoose'
import { DBConstants } from './DBConstant'

export const DBUserSchema = new Schema({
  phoneNumber: {
    type: String
  },
  password: {
    type: String
  },
  status: {
    type: String
  },
  ref_id: {
    type: Schema.Types.ObjectId,
    ref: DBConstants.UserDetailsCollection,
  }
},
  {
    timestamps: true,
  }
)

export const DBUserDetailsSchema = new Schema({
  block: {
    type: Boolean
  },
  email: {
    type: String
  },
  dob: {
    type: String
  },
  address: {
    city: {
      type: String
    },
    district: {
      type: String
    },
    state: {
      type: String
    },
    country: {
      type: String
    }
  }
}, { timestamps: true })



