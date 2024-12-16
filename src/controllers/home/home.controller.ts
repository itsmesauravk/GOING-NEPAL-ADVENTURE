import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import Trekking from "../../models/trekking.model.js"
import Tour from "../../models/tour.model.js"
import Wellness from "../../models/wellness.model.js"
import Blog from "../../models/blog.model.js"
import PlanTrip from "../../models/planTrip.model.js"
import Activity from "../../models/activities.model.js"
import QuoteAndCustomize from "../../models/quoteAndCustomize.js"
import UserDetails from "../../models/userDetails.js"

import { Model } from "mongoose"

const countDocuments = async (model: Model<any>, filter = {}) =>
  await model.countDocuments(filter)

const getCountDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const [
      trekkingCount,
      tourCount,
      wellnessCount,
      blogCount,
      planTripCountTotal,
      pendingPlanTripCount,
      viewedPlanTripCount,
      mailedPlanTripCount,
      activityCountTotal,
      activityPopularCount,
      activityActiveCount,
      quoteCountTotal,
      quotePendingCount,
      quoteViewedCount,
      quoteMailedCount,
      customizeCountTotal,
      customizePendingCount,
      customizeViewedCount,
      customizeMailedCount,
      usersCount,
    ] = await Promise.all([
      countDocuments(Trekking),
      countDocuments(Tour),
      countDocuments(Wellness),
      countDocuments(Blog),
      countDocuments(PlanTrip),
      countDocuments(PlanTrip, { status: "pending" }),
      countDocuments(PlanTrip, { status: "viewed" }),
      countDocuments(PlanTrip, { status: "mailed" }),
      countDocuments(Activity),
      countDocuments(Activity, { isPopular: true }),
      countDocuments(Activity, { isActivated: true }),
      countDocuments(QuoteAndCustomize, { requestType: "quote" }),
      countDocuments(QuoteAndCustomize, {
        requestType: "quote",
        status: "pending",
      }),
      countDocuments(QuoteAndCustomize, {
        requestType: "quote",
        status: "viewed",
      }),
      countDocuments(QuoteAndCustomize, {
        requestType: "quote",
        status: "mailed",
      }),
      countDocuments(QuoteAndCustomize, { requestType: "customize" }),
      countDocuments(QuoteAndCustomize, {
        requestType: "customize",
        status: "pending",
      }),
      countDocuments(QuoteAndCustomize, {
        requestType: "customize",
        status: "viewed",
      }),
      countDocuments(QuoteAndCustomize, {
        requestType: "customize",
        status: "mailed",
      }),
      countDocuments(UserDetails),
    ])

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Count details fetched successfully",
      data: {
        trekkingCount,
        tourCount,
        wellnessCount,
        blogCount,
        planTripCount: {
          total: planTripCountTotal,
          pending: pendingPlanTripCount,
          viewed: viewedPlanTripCount,
          mailed: mailedPlanTripCount,
        },
        activityCount: {
          total: activityCountTotal,
          popular: activityPopularCount,
          active: activityActiveCount,
        },
        quoteAndCustomizeCount: {
          quote: {
            total: quoteCountTotal,
            pending: quotePendingCount,
            viewed: quoteViewedCount,
            mailed: quoteMailedCount,
          },
          customize: {
            total: customizeCountTotal,
            pending: customizePendingCount,
            viewed: customizeViewedCount,
            mailed: customizeMailedCount,
          },
        },
        usersCount,
      },
    })
  } catch (error) {
    console.error("Error fetching count details:", error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    })
  }
}

export { getCountDetails }
