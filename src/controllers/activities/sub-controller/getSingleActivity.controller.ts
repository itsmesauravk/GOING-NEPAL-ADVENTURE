import Activity from "../../../models/activities.model.js"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

// get single by slug
const getSingleActivity = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug
    if (!slug) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Slug is required",
      })
    }

    const activity = await Activity.findOne({ slug, isActivated: true }).select(
      "-isAcitvated "
    )
    if (!activity) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Activity not found",
      })
    }
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
