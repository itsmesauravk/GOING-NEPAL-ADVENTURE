import { Request, Response } from "express"
import Trekking from "../../../models/trekking.model.js"
import { StatusCodes } from "http-status-codes"
import { QueryObjectType } from "../../../utils/types.js"

// Getting all treks with all the filtration, sorting and pagination
const getTrek = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      country,
      search,
      updatedAt,
      difficulty,
      sort,
      visibility,
      excludeId,
      maxDays,
      location,
    } = req.query

    // days: { min: minDays, max: maxDays },

    const queryObject: QueryObjectType = {}

    if (country) {
      queryObject.country = country as string
    }

    if (search) {
      queryObject.name = { $regex: search, $options: "i" } as any
    }

    if (difficulty && difficulty !== "all") {
      queryObject.difficulty = difficulty as string
    }
    //old
    // if (visibility && typeof visibility === "string") {
    //   queryObject[visibility] = "true" as string
    // }
    //updated visibility
    if (visibility === "all") {
      // No additional filter admin want to see all treks
    } else if (
      visibility === "isActivated" ||
      visibility === "isPopular" ||
      visibility === "isNewItem" ||
      visibility === "isFeatured"
    ) {
      queryObject[visibility] = "true" as string
    } else if (visibility === "notActivated") {
      queryObject.isActivated = "false" as string
    } else if (visibility === "notPopular") {
      queryObject.isPopular = "false" as string
    } else if (visibility === "notNewItem") {
      queryObject.isNewItem = "false" as string
    } else if (visibility === "notFeatured") {
      queryObject.isFeatured = "false" as string
    } else {
      // default: only show activated treks
      queryObject.isActivated = "true" as string
    }

    if (excludeId) {
      queryObject._id = { $ne: excludeId as string }
    }
    if (location) {
      queryObject.location = location as string
    }

    let apiData = Trekking.find(queryObject)

    //sorting

    let sorting = ""

    if (typeof sort === "string" && sort.trim().length > 0) {
      const validFields = [
        "name",
        "difficulty",
        "updatedAt",
        "createdAt",
        "price",
        "days.max",
        "days.min",
      ]
      const sortFields = sort
        .split(",")
        .filter((field) => validFields.includes(field.replace("-", "")))

      sorting = sortFields.join(" ")
      if (sorting) {
        apiData = apiData.sort(sorting)
      }
    } else {
      apiData = apiData.sort("-createdAt")
    }

    let page = Number(req.query.page) || 1
    let limit = Number(req.query.limit) || 10
    let skip = (page - 1) * limit

    apiData = apiData.skip(skip).limit(limit)

    const totalTrekCount = await Trekking.countDocuments(queryObject)

    // Calculate total pages
    const totalPages = Math.ceil(totalTrekCount / limit)

    const trek = await apiData

    if (!trek) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No trek found",
      })
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Trek found",
      data: trek,
      totalPages,
      nbhits: trek.length,
    })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    })
  }
}

export default getTrek
