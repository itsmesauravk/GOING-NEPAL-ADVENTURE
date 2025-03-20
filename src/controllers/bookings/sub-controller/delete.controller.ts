import { Booking } from "../../../models/booking.model.js"
import { StatusCodes } from "http-status-codes"
import { Request, Response } from "express"

const deleteBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    if (!id) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Please provide booking id" })
      return
    }

    const booking = await Booking.findByIdAndDelete(id)

    if (!booking) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Booking not found" })
      return
    }

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Booking deleted successfully" })
  } catch (error) {
    console.log("Delete Booking error:", error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal server error" })
  }
}

export { deleteBooking }
