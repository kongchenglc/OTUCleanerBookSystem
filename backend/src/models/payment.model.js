import mongoose, {schema} from 'mongoose'

const paymentSchema = new mongoose.schema(
  {
    bookingId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:Booking,
    required:true
    },
    amount:{
      type:Number, 
      required:true
    },
    paymentMethod:{
      type:String,
      enum:['Credit Card','PayPal','Bank Transfer'],
      required:true
    },
    paymentStatus:{
      type:String,
      enum:['Pending','Cancelled','Completed','Confirmed'],
      default:'Pending'
    },
    transactionId:{
      type:String,
      required:true,
      unique:true
    },
    paymentDate:{
      type:Date, 
      deafult: Date.now
    }
  }
)

export default Payment = mongoose.model("Payment",paymentSchema)