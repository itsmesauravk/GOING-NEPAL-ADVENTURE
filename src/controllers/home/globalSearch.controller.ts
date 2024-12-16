import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import Trekking from "../../models/trekking.model.js"
import Tour from "../../models/tour.model.js"
import Wellness from "../../models/wellness.model.js"

const globalSearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, sort, page = 1, limit = 20 } = req.query

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { overview: { $regex: search, $options: "i" } },
          ],
        }
      : {}

    const sortQuery = sort ? sort.toString().split(",").join(" ") : "createdAt"

    const skip = (Number(page) - 1) * Number(limit)

    // Aggregation for global search with total count
    const results = await Trekking.aggregate([
      { $match: query }, // Filter `trekkings`
      { $unionWith: { coll: "tours", pipeline: [{ $match: query }] } },
      { $unionWith: { coll: "wellnesses", pipeline: [{ $match: query }] } },
      { $unionWith: { coll: "activities", pipeline: [{ $match: query }] } },
      {
        $facet: {
          metadata: [{ $count: "totalCount" }], // Count total documents
          data: [
            { $sort: { [sortQuery]: 1 } }, // Sort the data
            { $skip: skip }, // Pagination
            { $limit: Number(limit) }, // Limit results
          ],
        },
      },
      {
        $project: {
          totalCount: { $arrayElemAt: ["$metadata.totalCount", 0] }, // Extract total count
          data: 1,
        },
      },
    ])

    const response = results[0] || { totalCount: 0, data: [] }

    if (response.data.length === 0) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No results found",
      })
      return
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Search results found",
      data: response.data,
      totalCount: response.totalCount,
    })
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    })
  }
}

export default globalSearch
