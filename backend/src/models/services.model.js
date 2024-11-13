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
    homeownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }
)

export const Service = mongoose.model("Service", serviceSchema)
