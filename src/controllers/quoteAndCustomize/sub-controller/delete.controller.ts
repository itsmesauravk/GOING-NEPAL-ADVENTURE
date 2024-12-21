import QuoteAndCustomize from "../../../models/quoteAndCustomize.js"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

// delete quote and customize
const deleteQuoteAndCustomize = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    if (!id) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Data is Invalid",
        error: "Invalid data",
      })
      return
    }

    const quoteAndCustomize = await QuoteAndCustomize.findByIdAndDelete(id)
    if (!quoteAndCustomize) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Quote and Customize not found",
        error: `Quote and Customize not found with id: ${id}`,
      })
      return
    }

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Quote and Customize deleted" })
  } catch (error) {
    let errorMessage = "Internal Server Error"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
      error: errorMessage,
    })
  }
}

export default deleteQuoteAndCustomize
