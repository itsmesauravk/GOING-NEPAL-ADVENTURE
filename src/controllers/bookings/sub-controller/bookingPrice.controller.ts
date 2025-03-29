import { BookingPrice } from "../../../models/bookingPrice.model.js"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

const addBookingPrice = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      adventureType,
      adventureId,
      solo,
      soloFourStar,
      soloFiveStar,
      singleSupplementary,
      singleSupplementaryFourStar,
      singleSupplementaryFiveStar,
      standardFourStar,
      standardFiveStar,
    } = req.body

    if (!adventureType || !adventureId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Please fill all the fields",
      })
      return
    }

    const bookingPrice = new BookingPrice({
      adventureType,
      trekId: adventureType === "Trekking" ? adventureId : null,
      tourId: adventureType === "Tour" ? adventureId : null,
      wellnessId: adventureType === "Wellness" ? adventureId : null,
      activityId: adventureType === "Activity" ? adventureId : null,
      solo,
      singleSupplementary,
      soloFourStar,
      soloFiveStar,
      singleSupplementaryFourStar,
      singleSupplementaryFiveStar,
      standardFourStar,
      standardFiveStar,
    })

    await bookingPrice.save()

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Booking price added successfully",
    })
  } catch (error) {
    if (error instanceof Error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      })
    }
  }
}

const updateBookingPrice = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      adventureType,
      adventureId,
      solo,
      soloFourStar,
      soloFiveStar,
      singleSupplementary,
      singleSupplementaryFourStar,
      singleSupplementaryFiveStar,
      standardFourStar,
      standardFiveStar,
    } = req.body

    if (!adventureType || !adventureId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Please fill all the fields",
      })
      return
    }

    // Define the query interface
    interface BookingPriceQuery {
      adventureType: string
      trekId?: string | null
      tourId?: string | null
      wellnessId?: string | null
      activityId?: string | null
    }

    // Initialize with base query
    const query: BookingPriceQuery = { adventureType }

    // Add the appropriate ID field based on adventure type
    if (adventureType === "Trekking") {
      query.trekId = adventureId
    } else if (adventureType === "Tour") {
      query.tourId = adventureId
    } else if (adventureType === "Wellness") {
      query.wellnessId = adventureId
    } else if (adventureType === "Activity") {
      query.activityId = adventureId
    }

    const bookingPrice = await BookingPrice.findOneAndUpdate(
      query,
      {
        solo,
        singleSupplementary,
        soloFourStar,
        soloFiveStar,
        singleSupplementaryFourStar,
        singleSupplementaryFiveStar,
        standardFourStar,
        standardFiveStar,
      },
      { new: true }
    )

    if (!bookingPrice) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Booking price not found",
      })
      return
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Booking price updated successfully",
    })
  } catch (error) {
    if (error instanceof Error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      })
    }
  }
}

const deleteBookingPrice = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bookingPriceId = req.params.id

    const bookingPrice = await BookingPrice.findByIdAndDelete(bookingPriceId)

    if (!bookingPrice) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Booking price not found",
      })
      return
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Booking price deleted successfully",
    })
  } catch (error) {
    if (error instanceof Error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      })
    }
  }
}

const getSingleBookingPrice = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { adventureId, adventureType } = req.params

    if (!adventureType || !adventureId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Please provide adventureType and adventureId",
      })
      return
    }

    // Define the query interface
    interface BookingPriceQuery {
      adventureType: string
      trekId?: string | null
      tourId?: string | null
      wellnessId?: string | null
      activityId?: string | null
    }

    // Initialize with base query
    const query: BookingPriceQuery = { adventureType }

    // Add the appropriate ID field based on adventure type
    if (adventureType === "Trekking") {
      query.trekId = adventureId
    } else if (adventureType === "Tour") {
      query.tourId = adventureId
    } else if (adventureType === "Wellness") {
      query.wellnessId = adventureId
    } else if (adventureType === "Activity") {
      query.activityId = adventureId
    }

    const bookingPrice = await BookingPrice.findOne(query)

    if (!bookingPrice) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Booking price not found",
      })
      return
    }

    res.status(StatusCodes.OK).json({
      success: true,
      bookingPrice,
    })
  } catch (error) {
    if (error instanceof Error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      })
    }
  }
}

export {
  addBookingPrice,
  updateBookingPrice,
  deleteBookingPrice,
  getSingleBookingPrice,
}
