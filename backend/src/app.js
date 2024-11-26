import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

const allowedOrigins = [
  'http://cleaner-book-system.s3-website.us-east-2.amazonaws.com',
  'https://cleaner-book-system.s3-website.us-east-2.amazonaws.com',
];

app.use(cors({
  origin: (ctx) => {
    const origin = ctx.origin;
    if (allowedOrigins.includes(origin) || origin.endsWith('.amazonaws.com')) {
      return origin;
    }
    return '*';
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// 3 main app configurations
// setting limit for json data for production
app.use(express.json({ limit: "16kb" }))
// configuration - for url encoding
app.use(express.urlencoded({ exntended: true, limit: "16kb" }))
// place to store public assets
app.use(express.static("public"))
// access and use user cookies, apply CRUD operations
app.use(cookieParser())

// routes import 
import userRouter from './routes/user.routes.js'
import bookingRouter from './routes/booking.routes.js'
import serviceRouter from './routes/service.routes.js'
import reviewRouter from './routes/review.routes.js'
import availabilityRouter from './routes/availability.routes.js'

//routes declartion
app.use("/api/v1/users", userRouter)
app.use("/api/v1/booking", bookingRouter)
app.use("/api/v1/services", serviceRouter)
app.use("/api/v1/reviews", reviewRouter)
app.use("/api/v1/avail", availabilityRouter)

export default app