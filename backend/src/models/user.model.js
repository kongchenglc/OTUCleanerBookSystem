import mongoose, {Schema} from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    avtar: {
      type: String,
      required: true
    },
    password:{
      type: String,
      required: [true, 'Password is required'],
    },
    phone: {
      type:String,
      required: true
    },
    address:{
      street:{
        type: string,
        required: true
      },
      city:{
        type: string,
        required: true,
      },
      state:{
        type: string,
        required: true,
      },
      zipCode:{
        type:string,
        required: true
      }, 
      country: {
        type: string,
        required: true
      }
    },
    profilePicture:{
      type:String,
    },
    dateJoined:{
      type: Date,
      default: Date.now
    },
    cleanerProfile:{
      experienceYears:{
        type:Number
      },
      hourlyRate:{
        type:Number
      },
      backgroundCheckStatus:{
        type:String,
        enum:['Pending','Completed','Failed'], default:'Pending'
      },
      rating:{
        type: Number,
        default: 0
      },
      verified:{
        type: Boolean,
        default: false,
      },
      availabilityStatus:{
        type:String,
        enum:['Available','Unavailabe'], default: 'Available'
      },
      servicesOffered: [
        {
          serviceId: {
            type: mongoose.Schema.Types.ObjectId ,
            ref: 'Service'
          },
          name: {
            type: String
          },
          rate: {
            type: Number
          }
      }
      ]
    },
    refreshToken:{
      type: string
    },
  }
)

export default User = mongoose.model("User", userSchema)