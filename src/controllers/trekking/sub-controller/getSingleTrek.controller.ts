import { Request, Response } from "express"
import Trekking from "../../../models/trekking.model.js"
import { uploadFile } from "../../../utils/cloudinary.js"
import { StatusCodes } from "http-status-codes"

// Getting single treks

const getSingleTrek = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = req.params.id
    const trek = await Trekking.findById(id)

    if (!trek) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No trek found",
      })
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Trek found",
      data: trek,
    })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    })
  }
}

export default getSingleTrek