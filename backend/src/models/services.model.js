import mongoose, { Schema } from "mongoose"

const serviceSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description:{
      type: String
    },
    basePrice:{
      type: Number,
      required: true
    },
    duration:{
      type: String
    },
    // changes for the updated schema start
    homeownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    cleanerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'User',
      required: false // cleaner is optional at first
    }
    // changes for the updated schema stop 
  }
)

export const Service = mongoose.model("Service", serviceSchema)
