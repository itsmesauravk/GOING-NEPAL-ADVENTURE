import { Request, Response } from "express"
import Trekking from "../../../models/trekking.model.js"
import {
  uploadFile,
  uploadVideo,
  deleteImage,
} from "../../../utils/cloudinary.js"
import { StatusCodes } from "http-status-codes"
import slug from "slug"
import { UploadApiResponse } from "cloudinary"

interface EditTrekRequest extends Request {
  files?: {
    thumbnail?: Express.Multer.File[]
    images?: Express.Multer.File[]
    video?: Express.Multer.File[]
    trekPdf?: Express.Multer.File[]
  }
  body: {
    trekId: string
    name?: string
    price?: number
    discount?: number
    country?: string
    minDays?: number
    maxDays?: number
    location?: string
    difficulty?: string
    groupSizeMin?: number
    groupSizeMax?: number
    startingPoint?: string
    endingPoint?: string
    accommodation?: string
    meal?: string
    bestSeason?: string
    overview?: string
    trekHighlights?: string
    itinerary?: string
    servicesCostIncludes?: string
    servicesCostExcludes?: string
    packingList?: string
    faq?: string
    note?: string
    imagesToDelete?: string[] // Array of image URLs to delete
    thumbnailToDelete?: boolean // Flag to delete existing thumbnail
    videoToDelete?: boolean // Flag to delete existing video
  }
}

const editTrek = async (req: EditTrekRequest, res: Response): Promise<void> => {
  try {
    const {
      trekId,
      imagesToDelete = [],
      thumbnailToDelete,
      videoToDelete,
      ...updateData
    } = req.body
    const files = req.files || {}

    // Find existing trek
    const existingTrek = await Trekking.findById(trekId)
    if (!existingTrek) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Trek not found",
      })
      return
    }

    // Handle file deletions first
    const updateFields: any = { ...updateData }

    // Delete specified images
    if (imagesToDelete.length > 0) {
      const remainingImages = existingTrek.images.filter(
        (img: string) => !imagesToDelete.includes(img)
      )
      // Delete images from Cloudinary
      await Promise.all(
        imagesToDelete.map(async (imageUrl) => {
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
    if (thumbnailToDelete && existingTrek.thumbnail) {
      await deleteImage(existingTrek.thumbnail)
      updateFields.thumbnail = null
    }
    if (files.thumbnail) {
      if (existingTrek.thumbnail) {
        await deleteImage(existingTrek.thumbnail)
      }
      const uploadedThumbnail = await uploadFile(
        files.thumbnail[0].path,
        "trekking/thumbnail"
      )
      updateFields.thumbnail = uploadedThumbnail?.secure_url
    }

    // Handle video deletion/update
    if (videoToDelete && existingTrek.video) {
      await deleteImage(existingTrek.video)
      updateFields.video = null
    }
    if (files.video) {
      if (existingTrek.video) {
        await deleteImage(existingTrek.video)
      }
      const uploadedVideo = await uploadVideo(
        files.video[0].path,
        "trekking/videos"
      )
      updateFields.video = uploadedVideo?.secure_url
    }

    // Handle new images upload
    if ((files.images || []).length > 0) {
      const newImages = await Promise.all(
        (files.images || []).map((image) =>
          uploadFile(image.path, "trekking/images")
        )
      )
      const validNewImages = newImages
        .filter((img): img is UploadApiResponse => img !== null)
        .map((img) => img.secure_url)

      updateFields.images = [
        ...(updateFields.images || existingTrek.images),
        ...validNewImages,
      ]
    }

    // Parse JSON fields if they exist
    if (updateData.name) {
      updateFields.slug = slug(updateData.name)
    }

    if (updateData.accommodation) {
      updateFields.accommodation = JSON.parse(updateData.accommodation)
    }
    if (updateData.discount !== undefined) {
      updateFields.discount = Number(updateData.discount)
    }
    if (updateData.minDays) {
      updateFields["days.min"] = Number(updateData.minDays)
    }
    if (updateData.maxDays) {
      updateFields["days.max"] = Number(updateData.maxDays)
    }
    if (updateData.groupSizeMin) {
      updateFields["groupSize.min"] = Number(updateData.groupSizeMin)
    }
    if (updateData.groupSizeMax) {
      updateFields["groupSize.max"] = Number(updateData.groupSizeMax)
    }
    if (updateData.price) {
      updateFields.price = Number(updateData.price)
    }
    if (updateData.location) {
      updateFields.location = JSON.parse(updateData.location)
    }
    if (updateData.overview) {
      updateFields.overview = JSON.parse(updateData.overview)
    }
    if (updateData.note) {
      updateFields.note = JSON.parse(updateData.note)
    }
    if (updateData.faq) {
      updateFields.faq = JSON.parse(updateData.faq)
    }
    if (updateData.meal) {
      updateFields.meal = JSON.parse(updateData.meal)
    }
    if (updateData.difficulty) {
      updateFields.difficulty = JSON.parse(updateData.difficulty)
    }
    if (updateData.startingPoint) {
      updateFields.startingPoint = JSON.parse(updateData.startingPoint)
    }
    if (updateData.endingPoint) {
      updateFields.endingPoint = JSON.parse(updateData.endingPoint)
    }
    if (updateData.country) {
      updateFields.country = JSON.parse(updateData.country)
    }

    if (updateData.bestSeason) {
      updateFields.bestSeason = JSON.parse(updateData.bestSeason)
    }
    if (updateData.trekHighlights) {
      updateFields.trekHighlights = JSON.parse(updateData.trekHighlights)
    }
    if (updateData.itinerary) {
      updateFields.itinerary = JSON.parse(updateData.itinerary)
    }
    if (updateData.servicesCostIncludes) {
      updateFields.servicesCostIncludes = JSON.parse(
        updateData.servicesCostIncludes
      )
    }
    if (updateData.servicesCostExcludes) {
      updateFields.servicesCostExcludes = JSON.parse(
        updateData.servicesCostExcludes
      )
    }
    if (updateData.packingList) {
      updateFields.packingList = JSON.parse(updateData.packingList)
    }
    if (updateData.faq) {
      updateFields.faq = JSON.parse(updateData.faq)
    }

    // Update trek with all changes
    const updatedTrek = await Trekking.findByIdAndUpdate(
      trekId,
      { $set: updateFields },
      { new: true, runValidators: true }
    )

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Trek updated successfully",
      data: updatedTrek,
    })
  } catch (error) {
    let errorMessage = "Internal server error"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
      error: errorMessage,
    })
  }
}

export default editTrek
