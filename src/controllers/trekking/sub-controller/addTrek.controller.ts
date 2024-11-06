import { Request, Response } from "express"
import Trekking from "../../../models/trekking.model.js"
import { uploadFile } from "../../../utils/cloudinary.js"
import { StatusCodes } from "http-status-codes"

// Custom MulterRequest to handle multiple file types
interface MulterRequest extends Request {
  files: {
    thumbnail?: Express.Multer.File[]
    images?: Express.Multer.File[]
    video?: Express.Multer.File[]
  }
}

const addTrek = async (
  req: MulterRequest,
  res: Response
): Promise<Response> => {
  try {
    // console.log(req.body)
    const {
      name,
      price,
      country,
      minDays,
      maxDays,
      location,
      difficulty,
      groupSizeMin,
      groupSizeMax,
      startingPoint,
      endingPoint,
      accommodation,
      meal,
      bestSeason,
      overview,
      trekHighlights,
      itinerary,
      servicesCostIncludes,
      servicesCostExcludes,
      packingList,
      faq,
      note,
    } = req.body

    // const { thumbnail, images, video } = req.files
    const thumbnail = req.files?.thumbnail
    const images = req.files?.images
    const video = req.files?.video

    // Validate required fields
    // console.log(req.body)
    if (
      !name ||
      !price ||
      //   !country ||
      !minDays ||
      !maxDays ||
      !location ||
      !difficulty ||
      !groupSizeMin ||
      !groupSizeMax ||
      !startingPoint ||
      !endingPoint ||
      !accommodation ||
      !meal ||
      !bestSeason ||
      !overview
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Please provide all required fields.",
      })
    }

    // Validate difficulty enum
    if (!["Easy", "Moderate", "Difficult"].includes(difficulty)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid difficulty level",
      })
    }

    // Validate meal enum
    if (!["Inclusive", "Exclusive"].includes(meal)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid meal type",
      })
    }

    // // Validate itinerary days match the total days
    // if (itinerary.length < 0) {
    //   return res.status(StatusCodes.BAD_REQUEST).json({
    //     success: false,
    //     message: "Itinerary days should match the total trek days",
    //   })
    // }

    // Validate links in trek highlights
    if (trekHighlights) {
      for (const highlight of trekHighlights) {
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

    // Upload thumbnail
    let uploadedThumbnail
    if (thumbnail) {
      uploadedThumbnail = await uploadFile(
        thumbnail[0].path,
        "trekking/thumbnail"
      )
      if (!uploadedThumbnail) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Error uploading thumbnail",
        })
      }
    }

    // Upload images
    const uploadedImages: string[] = []
    if (images && images.length > 0) {
      for (const image of images) {
        const uploadedImage = await uploadFile(image.path, "trekking/images")
        if (uploadedImage) {
          uploadedImages.push(uploadedImage.secure_url)
        }
      }
    }

    // Upload video
    let uploadedVideo: string | undefined
    if (video && video.length > 0) {
      const videoUpload = await uploadFile(video[0].path, "trekking/videos")
      if (videoUpload) {
        uploadedVideo = videoUpload.secure_url
      }
    }

    // Create new trek
    const newTrek = new Trekking({
      name,
      price,
      country,
      days: { min: minDays, max: maxDays },
      location,
      difficulty,
      groupSize: { min: groupSizeMin, max: groupSizeMax },
      startingPoint,
      endingPoint,
      accommodation,
      meal,
      bestSeason,
      overview,
      thumbnail: uploadedThumbnail?.secure_url,
      trekHighlights: trekHighlights || [],
      itinerary: itinerary || [],
      servicesCostIncludes: servicesCostIncludes || [],
      servicesCostExcludes: servicesCostExcludes || [],
      packingList: packingList || {
        general: [],
        clothes: [],
        firstAid: [],
        otherEssentials: [],
      },
      faq: faq || [],
      images: uploadedImages,
      video: uploadedVideo,
      note,
    })

    // Save trek to database
    const savedTrek = await newTrek.save()

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Trek added successfully",
      data: savedTrek,
    })
  } catch (error: any) {
    console.error("Error in addTrek:", error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    })
  }
}

export default addTrek
