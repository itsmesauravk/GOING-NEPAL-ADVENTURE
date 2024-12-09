import Activity from "../../../models/activities.model.js"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

// get all
const getActivities = async (req: Request, res: Response) => {
  try {
    const activities = await Activity.find({ isActivated: true })
    res.status(StatusCodes.OK).json({
      success: true,
      data: activities,
    })
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    })
  }
}

export default getActivities
