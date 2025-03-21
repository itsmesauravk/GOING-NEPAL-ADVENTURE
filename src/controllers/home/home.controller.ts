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
import { Booking } from "../../models/booking.model.js"

import { Model } from "mongoose"

const countDocuments = async (model: Model<any>, filter = {}) =>
  await model.countDocuments(filter)

const getCountDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const [
      trekkingCount,
      activeTrekingCount,
      tourCount,
      activeTourCount,
      wellnessCount,
      activeWellnessCount,
      blogCount,
      activeBlogCount,
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
      bookingCount,
      pendingBookingCount,
    ] = await Promise.all([
      countDocuments(Trekking),
      countDocuments(Trekking, { isActivated: true }),
      countDocuments(Tour),
      countDocuments(Tour, { isActivated: true }),
      countDocuments(Wellness),
      countDocuments(Wellness, { isActivated: true }),
      countDocuments(Blog),
      countDocuments(Blog, { isActive: true }),
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
      countDocuments(Booking),
      countDocuments(Booking, { status: "pending" }),
    ])

    // Aggregate the data to get the count per month
    const monthlyCountsPlanTrip = await PlanTrip.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" }, // Extract the month from the createdAt date
          year: { $year: "$createdAt" }, // Extract the year from the createdAt date
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" }, // Group by year and month
          totalCount: { $sum: 1 }, // Count the number of requests in each group
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }, // Sort by year and month in ascending order
      },
    ])

    const monthlyCountsRequestMails = await QuoteAndCustomize.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" }, // Extract year from createdAt field
            month: { $month: "$createdAt" }, // Extract month from createdAt field
          },
          totalCount: { $sum: 1 }, // Count all requests for this year/month
          quoteCount: {
            $sum: { $cond: [{ $eq: ["$requestType", "quote"] }, 1, 0] },
          }, // Count only "quote" type requests
          customizeCount: {
            $sum: { $cond: [{ $eq: ["$requestType", "customize"] }, 1, 0] },
          }, // Count only "customize" type requests
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }, // Sort results by year and month
      },
    ])

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Count details fetched successfully",
      data: {
        trekking: {
          total: trekkingCount,
          active: activeTrekingCount,
        },
        tour: {
          total: tourCount,
          active: activeTourCount,
        },
        wellness: {
          total: wellnessCount,
          active: activeWellnessCount,
        },
        blog: {
          total: blogCount,
          active: activeBlogCount,
        },
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
        monthlyCountsPlanTrip,
        monthlyCountsRequestMails,
        booking: {
          total: bookingCount,
          pending: pendingBookingCount,
        },
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
