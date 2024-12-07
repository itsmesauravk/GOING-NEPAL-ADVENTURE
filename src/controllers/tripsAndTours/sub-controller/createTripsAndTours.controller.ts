import TripsAndTours from "../../../models/tripsAndTours.model.js"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { uploadFile } from "../../../utils/cloudinary.js"

interface MulterRequest extends Request {
  file: Express.Multer.File
}

const createTripsAndTours = async (req: MulterRequest, res: Response) => {
  try {
    const { title, description } = req.body
    const coverImage = req.file

    if (!title || !coverImage) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "All Fields Are Required" })
    }

    const uploadImage = await uploadFile(coverImage.path, "tripsAndTours")

    if (!uploadImage) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Error Uploading Image" })
    }

    const newTripsAndTours = await TripsAndTours.create({
      title,
      description,
      coverImage: uploadImage.secure_url,
    })

    if (!newTripsAndTours) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Error Creating Trips And Tours" })
    }

    return res
      .status(StatusCodes.CREATED)
      .json({ success: true, message: "Trips And Tours Created Successfully" })
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message })
  }
}

export default createTripsAndTours
