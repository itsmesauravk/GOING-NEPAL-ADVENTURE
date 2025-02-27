import { Request, Response } from "express"
import Tour from "../../../models/tour.model.js"
import {
  uploadFile,
  uploadVideo,
  deleteImage,
} from "../../../utils/cloudinary.js"
import { StatusCodes } from "http-status-codes"
import slug from "slug"
import TripsAndTours from "../../../models/tripsAndTours.model.js"
import { UploadApiResponse } from "cloudinary"

interface EditTourRequest extends Request {
  files?: {
    thumbnail?: Express.Multer.File[]
    images?: Express.Multer.File[]
    video?: Express.Multer.File[]
  }
  body: {
    tourId: string
    name?: string
    price?: number
    discount?: number
    country?: string
    tripType?: string
    tourLanguage?: string
    maxAltitude?: string
    suitableAge?: string
    arrivalLocation?: string
    departureLocation?: string
    minDays?: number
    maxDays?: number
    location?: string
    minGroupSize?: number
    maxGroupSize?: number
    startingPoint?: string
    endingPoint?: string
    accommodation?: string
    thingsToKnow?: string
    meal?: string
    bestSeason?: string
    overview?: string
    highlights?: string
    itinerary?: string
    servicesCostIncludes?: string
    servicesCostExcludes?: string
    faq?: string
    note?: string
    imagesToDelete?: string
    thumbnailToDelete?: string
    videoToDelete?: string
  }
}

const editTour = async (
  req: EditTourRequest,
  res: Response
): Promise<Response> => {
  try {
    const {
      tourId,
      imagesToDelete,
      thumbnailToDelete,
      videoToDelete,
      tripType,
      ...updateData
    } = req.body

    const files = req.files || {}

    // Find existing tour
    const existingTour = await Tour.findById(tourId)
    if (!existingTour) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Tour not found",
      })
    }

    // Handle file deletions first
    const updateFields: any = { ...updateData }

    // Parse imagesToDelete from JSON string
    const imagesToDeleteArray = imagesToDelete ? JSON.parse(imagesToDelete) : []

    // Delete specified images
    if (imagesToDeleteArray.length > 0) {
      const remainingImages = existingTour.images.filter(
        (img: string) => !imagesToDeleteArray.includes(img)
      )
      // Delete images from Cloudinary
      await Promise.all(
        imagesToDeleteArray.map(async (imageUrl: string) => {
          try {
            await deleteImage(imageUrl)
          } catch (error) {
            console.error(`Failed to delete image: ${imageUrl}`, error)
          }
        })
      )
      updateFields.images = remainingImages
    }

    // Handle thumbnail deletion/update
    if (thumbnailToDelete === "true" && existingTour.thumbnail) {
      await deleteImage(existingTour.thumbnail)
      updateFields.thumbnail = null
    }
    if (files.thumbnail) {
      if (existingTour.thumbnail) {
        await deleteImage(existingTour.thumbnail)
      }
      const uploadedThumbnail = await uploadFile(
        files.thumbnail[0].path,
        "tour/thumbnail"
      )
      updateFields.thumbnail = uploadedThumbnail?.secure_url
    }

    // Handle video deletion/update
    if (videoToDelete === "true" && existingTour.video) {
      await deleteImage(existingTour.video)
      updateFields.video = null
    }
    if (files.video) {
      if (existingTour.video) {
        await deleteImage(existingTour.video)
      }
      const uploadedVideo = await uploadVideo(
        files.video[0].path,
        "tour/videos"
      )
      updateFields.video = uploadedVideo?.secure_url
    }

    // Handle new images upload
    if (files.images && files.images.length > 0) {
      const newImages = await Promise.all(
        files.images.map((image) => uploadFile(image.path, "tour/images"))
      )
      const validNewImages = newImages
        .filter((img): img is UploadApiResponse => img !== null)
        .map((img) => img.secure_url)

      updateFields.images = [
        ...(updateFields.images || existingTour.images),
        ...validNewImages,
      ]
    }

    // Update slug if name changes
    if (updateData.name) {
      updateFields.slug = slug(updateData.name)
    }

    if (updateData.discount !== undefined) {
      updateFields.discount = Number(updateData.discount)
    }

    // Handle days object structure
    if (updateData.minDays || updateData.maxDays) {
      updateFields.days = {
        min: updateData.minDays || (existingTour.days?.min ?? 0),
        max: updateData.maxDays || (existingTour.days?.max ?? 0),
      }
    }

    // Handle groupSize object structure
    if (updateData.minGroupSize || updateData.maxGroupSize) {
      updateFields.groupSize = {
        min: updateData.minGroupSize || (existingTour.groupSize?.min ?? 0),
        max: updateData.maxGroupSize || (existingTour.groupSize?.max ?? 0),
      }
    }

    // Handle trip type update
    if (tripType) {
      const parsedTripType = JSON.parse(tripType)

      updateFields.tripType = parsedTripType.title
      updateFields.tripTypeId = parsedTripType._id

      // If trip type changed, updat€e tour counts
      if (parsedTripType._id !== existingTour.tripTypeId) {
        // Update old trip type count
        const oldTotalTours = await Tour.countDocuments({
          tripTypeId: existingTour.tripTypeId,
        })
        await TripsAndTours.findByIdAndUpdate(
          existingTour.tripTypeId,
          { totalTours: oldTotalTours - 1 },
          { new: true }
        )

        // Update new trip type count
        const newTotalTours = await Tour.countDocuments({
          tripTypeId: parsedTripType._id,
        })
        await TripsAndTours.findByIdAndUpdate(
          parsedTripType.id,
          { totalTours: newTotalTours + 1 },
          { new: true }
        )
      }
    }

    // Validate meal type if it's being updated
    if (
      updateData.meal &&
      !["Inclusive", "Exclusive"].includes(updateData.meal)
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid meal type",
      })
    }

    const normalFields = [
      "name",
      "price",
      "country",
      "tourLanguage",
      "maxAltitude",
      "suitableAge",
      "arrivalLocation",
      "departureLocation",
      "location",
      "groupSizeMin",
      "groupSizeMax",
      "startingPoint",
      "endingPoint",
      "meal",
      "overview",
      "note",
    ]

    normalFields.forEach((field) => {
      if (updateData[field as keyof typeof updateData]) {
        updateFields[field] = updateData[field as keyof typeof updateData]
      }
    })

    // Parse JSON fields
    const jsonFields = [
      "accommodation",
      "thingsToKnow",
      "bestSeason",
      "highlights",
      "itinerary",
      "servicesCostIncludes",
      "servicesCostExcludes",
      "faq",
    ]

    jsonFields.forEach((field) => {
      if (updateData[field as keyof typeof updateData]) {
        try {
          updateFields[field] = JSON.parse(
            updateData[field as keyof typeof updateData] as string
          )
        } catch (error) {
          console.error(`Error parsing ${field}:`, error)
        }
      }
    })

    // Validate links in trek highlights if being updated
    if (updateFields.highlights) {
      for (const highlight of updateFields.highlights) {
        if (highlight.links) {
          for (const link of highlight.links) {
            if (!link.text || !link.url) {
              return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid links in trek highlights",
              })
            }
          }
        }
      }
    }

    // Update tour with all changes
    const updatedTour = await Tour.findByIdAndUpdate(
      tourId,
      { $set: updateFields },
      { new: true, runValidators: true }
    )

    if (!updatedTour) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Error updating tour",
      })
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Tour updated successfully",
      data: updatedTour,
    })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to update tour",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    })
  }
}

export default editTour
