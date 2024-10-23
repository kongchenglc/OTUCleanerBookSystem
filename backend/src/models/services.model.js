import mongoose, {schema} from mongoose

const serviceSchema = new mongoose.schema(
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

export default Service = mongoose.model("Service", serviceSchema)
