const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
      phone_no: {
        type: String,
       
      },
      pass: {
        type: String,
      },
      status: {
        type: Boolean
      },ref_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
      }
    
    },
    
    {
      timestamps: true,
    }
  );
  const userDetailsSchema = new mongoose.Schema(
    {
      block:{
        type:Boolean
      },
      email: {
        type: String,
      },
      DOB: {
        type: String,
      },
      
      address: {
        type: "object",
        required: ["state", "district", "city", "country"],
        properties: {
          state: {
            type: "string",           
          },
          district: {
            type: "string",           
          },
          city: {
          type: "string",            
          },
          country: {
            type: "string",
            
          }
        }}
    },
    {
      timestamps: true,
    }
  );

  

  const User = mongoose.model("user", userSchema);
const UserDetails = mongoose.model("userDetails", userDetailsSchema);
  
module.exports={User,UserDetails}