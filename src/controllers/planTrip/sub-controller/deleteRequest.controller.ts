import PlanTrip from "../../../models/planTrip.model.js"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

export const deleteRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params

    const deleteRequest = await PlanTrip.findByIdAndDelete(id)
    if (!deleteRequest) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Unable to delete Request",
      })
      return
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Request deleted successfully",
    })
  } catch (error) {
    let message = "Internal Server Error"
    if (error instanceof Error) {
      message = error.message
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
      error: message,
    })
  }
}

export default deleteRequest
