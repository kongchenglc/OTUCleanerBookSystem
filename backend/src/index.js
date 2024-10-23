import dotenv from 'dotenv'

import mongoose from 'mongoose';
import { DB_NAME } from './constants.js'
import connectDB from './db/index.js';

dotenv.config({
  path: './env'
})

connectDB()
.then(()=>{
  app.on("error",(error) => {
    console.log("Err: ", error);
    throw error
  })
  app.listen(process.env.PORT || 8000, () => {
    console.log(` Server is running at port: ${process.env.PORT}`);
  })

})
.catch((error) => {
  console.log("MONGO DB connection failed !!!", error); 
})   