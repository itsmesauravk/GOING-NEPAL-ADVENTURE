import UserDetails from "../../models/userDetails.js"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

// Get all user details
const getUserDetails = async (req: Request, res: Response) => {
  try {
    const userDetails = await UserDetails.find()

    if (userDetails.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No User Details Found",
      })
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: userDetails,
    })
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    })
  }
}

export { getUserDetails }
