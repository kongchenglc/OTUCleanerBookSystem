import mongoose, {Schema} from "mongoose";

const availabilitySchema = new Schema({
  cleanerId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  date:{
    type: Date,
    required:true
  },
  timeSlots:[
    {
      startTime: {type: String, required: true},
      endTime: {type: String, required: true}
    }
  ],
  isAvailable:{
    type: Boolean,
    default:true
  }
  },{timestamps:true}
)

export const Availability = mongoose.model("Availability",availabilitySchema)