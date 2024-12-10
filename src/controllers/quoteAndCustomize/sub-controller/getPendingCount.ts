import QuoteAndCustomize from "../../../models/quoteAndCustomize.js"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

// get pending count
const getPendingCount = async (req: Request, res: Response) => {
  try {
    const result = await QuoteAndCustomize.aggregate([
      {
        $facet: {
          totalPending: [
            { $match: { status: "pending" } },
            { $count: "count" },
          ],
          quotePending: [
            { $match: { status: "pending", requestType: "quote" } },
            { $count: "count" },
          ],
          customizePending: [
            { $match: { status: "pending", requestType: "customize" } },
            { $count: "count" },
          ],
          totalQuote: [
            { $match: { requestType: "quote" } },
            { $count: "count" },
          ],
          totalCustomize: [
            { $match: { requestType: "customize" } },
            { $count: "count" },
          ],
        },
      },
      {
        $project: {
          totalPending: { $arrayElemAt: ["$totalPending.count", 0] },
          quotePending: { $arrayElemAt: ["$quotePending.count", 0] },
          customizePending: { $arrayElemAt: ["$customizePending.count", 0] },
          totalQuote: { $arrayElemAt: ["$totalQuote.count", 0] },
          totalCustomize: { $arrayElemAt: ["$totalCustomize.count", 0] },
        },
      },
    ])

    // If no result is found, set counts to 0
    const counts = result[0] || {
      totalPending: 0,
      quotePending: 0,
      customizePending: 0,
      totalQuote: 0,
      totalCustomize: 0,
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      data: counts,
    })
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    })
  }
}

export default getPendingCount
