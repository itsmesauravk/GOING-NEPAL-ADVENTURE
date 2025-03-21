import QuoteAndCustomize from "../../../models/quoteAndCustomize.js"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

const getSingleRequest = async (req: Request, res: Response) => {
  try {
    const request = await QuoteAndCustomize.findById(req.params.id)
    if (!request) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Request not found" })
    }

    await request.updateOne({ status: "viewed" })

    res.status(StatusCodes.OK).json({ success: true, data: request })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    })
  }
}

export default getSingleRequest
