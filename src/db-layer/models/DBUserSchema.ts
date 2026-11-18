import { Schema } from 'mongoose'

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
  email: {
    type: String
  },
  dob: {
    type: String
  },
  enable: {
    type: Boolean
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
},
  {
    timestamps: true,
  }
)





