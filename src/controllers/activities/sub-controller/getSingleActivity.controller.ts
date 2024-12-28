import Activity from "../../../models/activities.model.js"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

// get single by slug
const getSingleActivity = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug
    const { q } = req.query
    if (!slug) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Slug is required",
      })
    }

    let queryObject = {}

    if (q && q === "a") {
      //this is for admin request to view all activities including the deactivated ones
      queryObject = {
        slug: slug,
      }
    } else {
      queryObject = {
        slug: slug,
        isActivated: true,
      }
    }

    const activity = await Activity.findOne(queryObject).select("-isAcitvated ")
    if (!activity) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Activity not found",
      })
    }
    activity.viewsCount += 1
    await activity.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Activity fetched successfully",
      data: activity,
    })
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    })
  }
}

export default getSingleActivity
