import QuoteAndCustomize from "../../../models/quoteAndCustomize.js"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

const getRequests = async (req: Request, res: Response) => {
  try {
    const { requestType, itemType, status, sort } = req.query

    const queryObject: any = {}
    if (requestType) queryObject.requestType = requestType
    if (itemType) queryObject.itemType = itemType
    if (status) queryObject.status = status

    // Sorting query string
    const sortQuery = sort
      ? (sort as string).split(",").join(" ")
      : "-status -createdAt"

    // Pagination parameters
    const skip = Number(req.query.skip) || 0
    const limit = Number(req.query.limit) || 20

    const result = await QuoteAndCustomize.find(queryObject)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)

    // If no results are found, return 404
    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No requests found",
      })
    }

    // Return the results with counts and data
    return res.status(StatusCodes.OK).json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    })
  }
}

export default getRequests
