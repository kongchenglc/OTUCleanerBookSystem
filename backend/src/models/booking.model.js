import mongoose, {schema} from "mongoose"

const bookingSchema = new mongoose.schema(
  {
    homeownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required: true
    },
    cleanerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required: true
    },
    service: {
      serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Service",
        required: true
      },
      name:{ 
        type: String, 
        required:true
      },
      rate:{
        type:Number,
        required: true
      },
      bookingDate:{
        type: Date,
        required: true
      },
      status: {
        type: String,
        enum: ['Pending','Confirmed','Completed','Cancelled'],
        default:'Pending'
      },
      totalPrice:{
        type: Number,
        required: true,
      },
      specialInstructions:{
        type: String
      },
    }
  }
)

export default Booking = mongoose.model("Booking", bookingSchema)