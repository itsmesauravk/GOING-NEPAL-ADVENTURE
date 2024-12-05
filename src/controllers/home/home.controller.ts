import Trekking from "../../models/trekking.model.js"
import Tour from "../../models/tour.model.js"
import Wellness from "../../models/wellness.model.js"
import Blog from "../../models/blog.model.js"
import PlanTrip from "../../models/planTrip.model.js"

import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

// getting all the count details for dashboard
const getCountDetails = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const trekkingCount = await Trekking.countDocuments()
    const tourCount = await Tour.countDocuments()
    const wellnessCount = await Wellness.countDocuments()
    const blogCount = await Blog.countDocuments()
    const planTripCount = await PlanTrip.countDocuments()

    //count pending and completed planTripCount
    const pendingPlanTripCount = await PlanTrip.countDocuments({
      status: "pending",
    })
    const viewedPlanTripCount = await PlanTrip.countDocuments({
      status: "viewed",
    })

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Count details fetched successfully",
      data: {
        trekkingCount,
        tourCount,
        wellnessCount,
        blogCount,
        planTripCount,
        pendingPlanTripCount,
        viewedPlanTripCount,
      },
    })
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    })
  }
}

export { getCountDetails }
