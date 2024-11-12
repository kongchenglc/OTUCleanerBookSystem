import mongoose, {Schema} from "mongoose";

const reviewSchema = new Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  homeownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cleanerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating:{
    type: Number,
    min:1,
    max:5,
    required: true
  },
  comment:{
    type: String
  },  
}
)

export const Review = mongoose.model("Review", reviewSchema)