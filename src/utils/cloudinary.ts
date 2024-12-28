import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv"

dotenv.config()

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.error("Cloudinary config not found")
  process.exit(1)
}

const uploadFile = async (file: string, folder: string) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(file, {
      folder: `/Going Nepal Adventure/${folder}`,
      options: { resource_type: "auto" },
    })

    if (!uploadResult) {
      throw new Error("Error uploading file")
    }
    // console.log(uploadResult);
    return uploadResult
  } catch (error) {
    console.log("Error on cloudinary :", error)
  }
}

//upload video
const uploadVideo = async (file: string, folder: string) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(file, {
      folder: `/Going Nepal Adventure/${folder}`,
      resource_type: "video",
    })
    if (!uploadResult) {
      throw new Error("Error uploading file")
    }
    // console.log(uploadResult);
    return uploadResult
  } catch (error) {
    console.log("Error on cloudinary :", error)
  }
}
const deleteImage = async (secureUrl: string) => {
  try {
    if (!secureUrl) {
      throw new Error("secureUrl is required")
    }

    // Extract the public_id
    const publicId = secureUrl
      .split("/")
      .slice(7) // Remove initial URL components
      .join("/") // Join remaining components
      .replace(/\.[^/.]+$/, "") // Remove the file extension

    // console.log(`Extracted public_id: ${publicId}`)

    const updatedString = publicId.replace(/%20/g, " ")

    // Delete the image using the public_id
    const result = await cloudinary.uploader.destroy(updatedString)

    if (result.result !== "ok") {
      throw new Error("Error deleting file")
    }

    // return result
  } catch (error) {
    console.error("Error in deleteImage function:", error)
    throw error
  }
}

// delete file
// const deleteFile = async (public_id: string) => {
//   // console.log(public_id);
//   try {
//     const result = await cloudinary.uploader.destroy(public_id)
//     if (!result) {
//       throw new Error("Error deleting file")
//     }
//     // console.log(result);
//     return result
//   } catch (error) {
//     console.log("Error on cloudinary:", error)
//   }
// }

export { uploadFile, uploadVideo, deleteImage }
