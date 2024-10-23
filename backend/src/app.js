import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
  // origin you are allowing
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))

// 3 main app configurations
// setting limit for json data for production
app.use(express.json({limit: "16kb"}))
// configuration - for url encoding
app.use(express.urlencoded({exntended:true, limit:"16kb"}))
// place to store public assets
app.use(express.static("public"))
// access and use user cookies, apply CRUD operations
app.use(cookieParser())

export default app