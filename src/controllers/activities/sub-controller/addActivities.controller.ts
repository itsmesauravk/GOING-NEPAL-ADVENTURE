import Activity from "../../../models/activities.model.js"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import slug from "slug"
import { uploadFile, uploadVideo } from "../../../utils/cloudinary.js"

// Define TypeScript interface for Multer request
interface MulterRequest extends Request {
  files: {
    thumbnail?: Express.Multer.File[]
    image?: Express.Multer.File[]
    video?: Express.Multer.File[]
  }
}

// Function to handle activity creation
const createActivity = async (req: MulterRequest, res: Response) => {
  try {
    const {
      title,
      price,
      country,
      location,
      groupSizeMin,
      groupSizeMax,
      bestSeason,
      overview,
      serviceIncludes,
      thingsToKnow,
      FAQs,
    } = req.body

    const groupSize = {
      min: groupSizeMin,
      max: groupSizeMax,
    }

    // console.log(req.body)

    // const test = false
    // if (!test) {
    //   return res.status(StatusCodes.OK).json({
    //     success: false,
    //     message: "Activity created successfully",
    //   })
    // }

    // Manual validation for required fields
    if (
      !title ||
      !price ||
      !country ||
      !location ||
      !groupSize ||
      !bestSeason ||
      !overview ||
      !serviceIncludes
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "All required fields must be provided",
      })
    }

    const { thumbnail, image, video } = req.files || {}

    // Generate slug from title
    const slugTitle = slug(title, { lower: true })

    // Upload thumbnail
    const thumbnailUrl = thumbnail
      ? (await uploadFile(thumbnail[0].path, "/activities/thumbnail"))
          ?.secure_url
      : null

    // Upload image images
    const galleryUrls = image
      ? await Promise.all(
          image.map(
            async (img) =>
              (
                await uploadFile(img.path, "/activities/image")
              )?.secure_url
          )
        )
      : []

    // Upload video
    const videoUrl = video
      ? await uploadVideo(video[0].path, "/activities/video")
      : null

    // Create new activity document
    const newActivity = new Activity({
      title,
      slug: slugTitle,
      price,
      country,
      location,
      groupSize,
      bestSeason: JSON.parse(bestSeason),
      thumbnail: thumbnailUrl,
      overview,
      serviceIncludes: JSON.parse(serviceIncludes),
      thingsToKnow: JSON.parse(thingsToKnow) || "",
      FAQs: JSON.parse(FAQs) || [],
      gallery: galleryUrls,
      video: videoUrl,
    })

    await newActivity.save()

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Activity created successfully",
    })
  } catch (error: any) {
    console.error("Error creating activity:", error.message)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export default createActivity
