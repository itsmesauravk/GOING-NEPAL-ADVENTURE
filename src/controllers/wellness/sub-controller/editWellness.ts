import { Request, Response } from "express"
import Wellness from "../../../models/wellness.model.js"
import {
  uploadFile,
  uploadVideo,
  deleteImage,
} from "../../../utils/cloudinary.js"
import { StatusCodes } from "http-status-codes"
import slug from "slug"
import { UploadApiResponse } from "cloudinary"

interface EditWellnessRequest extends Request {
  files?: {
    thumbnail?: Express.Multer.File[]
    images?: Express.Multer.File[]
    video?: Express.Multer.File[]
  }
  body: {
    wellnessId: string
    name?: string
    price?: number
    country?: string
    minDays?: number
    maxDays?: number
    location?: string
    language?: string
    suitableAge?: string
    maxAltitude?: string
    groupSizeMin?: number
    groupSizeMax?: number
    startingPoint?: string
    endingPoint?: string
    arrivalLocation?: string
    departureLocation?: string
    clothesType?: string
    accommodation?: string
    thingsToKnow?: string
    meal?: string
    bestSeason?: string
    overview?: string
    highlights?: string // Changed from wellnessHighlights to match frontend
    itinerary?: string
    servicesCostIncludes?: string
    servicesCostExcludes?: string
    faq?: string
    note?: string
    imagesToDelete?: string
    thumbnailToDelete?: string // Changed to string to match frontend's "true"
    videoToDelete?: string // Changed to string to match frontend's "true"
  }
}

const editWellness = async (
  req: EditWellnessRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      wellnessId,
      imagesToDelete,
      thumbnailToDelete,
      videoToDelete,
      ...updateData
    } = req.body
    const files = req.files || {}

    // Find existing wellness
    const existingWellness = await Wellness.findById(wellnessId)
    if (!existingWellness) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Wellness program not found",
      })
      return
    }

    // Handle file deletions first
    const updateFields: any = { ...updateData }

    // Parse imagesToDelete from JSON string
    const imagesToDeleteArray = imagesToDelete ? JSON.parse(imagesToDelete) : []

    // Delete specified images
    if (imagesToDeleteArray.length > 0) {
      const remainingImages = existingWellness.images.filter(
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
    if (thumbnailToDelete === "true" && existingWellness.thumbnail) {
      await deleteImage(existingWellness.thumbnail)
      updateFields.thumbnail = null
    }
    if (files.thumbnail) {
      if (existingWellness.thumbnail) {
        await deleteImage(existingWellness.thumbnail)
      }
      const uploadedThumbnail = await uploadFile(
        files.thumbnail[0].path,
        "wellness/thumbnail"
      )
      updateFields.thumbnail = uploadedThumbnail?.secure_url
    }

    // Handle video deletion/update
    if (videoToDelete === "true" && existingWellness.video) {
      await deleteImage(existingWellness.video)
      updateFields.video = null
    }
    if (files.video) {
      if (existingWellness.video) {
        await deleteImage(existingWellness.video)
      }
      const uploadedVideo = await uploadVideo(
        files.video[0].path,
        "wellness/videos"
      )
      updateFields.video = uploadedVideo?.secure_url
    }

    // Handle new images upload
    if (files.images && files.images.length > 0) {
      const newImages = await Promise.all(
        files.images.map((image) => uploadFile(image.path, "wellness/images"))
      )
      const validNewImages = newImages
        .filter((img): img is UploadApiResponse => img !== null)
        .map((img) => img.secure_url)

      updateFields.images = [
        ...(updateFields.images || existingWellness.images),
        ...validNewImages,
      ]
    }

    // Update slug if name changes
    if (updateData.name) {
      updateFields.slug = slug(updateData.name)
    }

    // Handle days object structure
    if (updateData.minDays || updateData.maxDays) {
      updateFields.days = {
        min: updateData.minDays || (existingWellness.days?.min ?? 0),
        max: updateData.maxDays || (existingWellness.days?.max ?? 0),
      }
    }

    // Handle groupSize object structure
    if (updateData.groupSizeMin || updateData.groupSizeMax) {
      updateFields.groupSize = {
        min: (updateData.groupSizeMin || existingWellness.groupSize?.min) ?? 0,
        max: (updateData.groupSizeMax || existingWellness.groupSize?.max) ?? 0,
      }
    }

    const normalFields = [
      "name",
      "price",
      "country",
      "location",
      "language",
      "suitableAge",
      "maxAltitude",
      "startingPoint",
      "endingPoint",
      "arrivalLocation",
      "departureLocation",
      "clothesType",
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

    // Update wellness program with all changes
    const updatedWellness = await Wellness.findByIdAndUpdate(
      wellnessId,
      { $set: updateFields },
      { new: true, runValidators: true }
    )

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Wellness program updated successfully",
      data: updatedWellness,
    })
  } catch (error) {
    console.error("Error in editWellness:", error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to update wellness program",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    })
  }
}

export default editWellness
