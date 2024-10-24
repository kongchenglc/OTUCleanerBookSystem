import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

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
    }
  },
  {
    timestamps:true
  }
)
// pre hook "functionalities , then callback "
// arrow function does not have this reference
// thats why using function
userSchema.pre("save", async function (next){
  if(!this.isModified("password")) return next()
    // encrypt the password
  this.password = bcrypt.hash(this.password, 10)
  next()
})

// designing a custom method , add a custom method in userSchema 
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

// method to generate access token
userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
    {
      // payload name - database name
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}


// refresh token is used many times, so we only pass id 
userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
    {
      // payload name - database name
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

userSchema.method.generateRefreshToken = function(){}

export default User = mongoose.model("User", userSchema)