import {v2 as cloudinary} from "cloudinary"
// for file sys management m read & write
import fs from "fs"
// unlink - when files are unlink, it their but not lined - deleted

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_CLOUD_NAME 
  // Click 'View API Keys' above to copy your API secret
});

const uploadOnCLoudinary = async (localFilePath) => {
  try{
    if(!localFilePath) return null
    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type:"auto"
    })
    //file has been uploaded successfully
    console.log("File is uploaded on cloudinary", response.url);
    return response

  } catch(error){
    // remove the locally saved temporary file as the upload operation got failed
    fs.unlinkSync(localFilePath)
    return null;
  }
}

export {uploadOnCLoudinary}
