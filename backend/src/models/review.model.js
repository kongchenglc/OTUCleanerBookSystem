import mongoose, {schema} from "mongoose";

const reviewSchema = new mongoose.Schema({
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

export default Review = mongoose.model("Review", reviewSchema)