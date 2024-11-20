import { Request, Response } from "express"
import Trekking from "../../../models/trekking.model.js"
import { StatusCodes } from "http-status-codes"

// Deleting single trek
const deleteTrek = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Id is required",
      })
    }

    const trek = await Trekking.findByIdAndDelete(id)

    if (!trek) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No trek found",
      })
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Trek deleted",
    })
  } catch (error: any) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    })
  }
}

export default deleteTrek
