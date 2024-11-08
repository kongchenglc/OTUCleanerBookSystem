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
    }
  }
)

export const Service = mongoose.model("Service", serviceSchema)
