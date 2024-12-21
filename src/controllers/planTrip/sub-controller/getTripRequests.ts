import PlanTrip from "../../../models/planTrip.model.js"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { QueryObjectType } from "../../../utils/types.js"

const getTripRequests = async (req: Request, res: Response) => {
  try {
    const { status, sort, search } = req.query

    let queryObject: QueryObjectType = {}

    if (status) {
      queryObject.status = status as string
    }

    if (search) {
      queryObject.fullName = { $regex: search, $options: "i" } as any
    }

    let tripRequests = PlanTrip.find(queryObject)

    let sorting = "-createdAt"

    if (typeof sort === "string" && sort.trim().length > 0) {
      sorting = sort
    }

    let page = Number(req.query.page) || 1
    let limit = Number(req.query.limit) || 10
    let skip = (page - 1) * limit

    tripRequests = tripRequests.sort(sorting).limit(limit).skip(skip)

    const total = await PlanTrip.countDocuments(queryObject)

    const totalPages = Math.ceil(total / limit)

    const requests = await tripRequests

    if (!requests || requests.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No trip requests found",
      })
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Trip requests fetched successfully",
      data: requests,
      totalPages,
      nbhits: requests.length,
    })
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    })
  }
}

export default getTripRequests
