import { Request, Response } from "express"
import Trekking from "../../../models/trekking.model.js"
import { uploadFile } from "../../../utils/cloudinary.js"
import { StatusCodes } from "http-status-codes"
import { BookingPrice } from "../../../models/bookingPrice.model.js"

// Getting single treks

const getTrekBySlug = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const slug = req.params.slug

    const trek = await Trekking.findOne({ slug })

   

    if (!trek) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No trek found",
      })
    }
    const bookingDetails = await BookingPrice.findOne({
      adventureType: "Trekking",
      trekId: trek?._id,
    })

    if (trek) {
      trek.viewsCount += 1
      await trek.save()
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Trek found",
      data: trek,
      bookingDetails,
    })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    })
  }
}

export default getTrekBySlug
