import { Request, Response } from "express"
import Tour from "../../../models/tour.model.js"
import { StatusCodes } from "http-status-codes"
import { QueryObjectType } from "../../../utils/types.js"

// Getting all tours with all the filtration, sorting and pagination
const getAllTours = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { search, updatedAt, sort } = req.query

    const queryObject: QueryObjectType = {}

    if (search) {
      queryObject.name = { $regex: search, $options: "i" } as any
    }

    let apiData = Tour.find(queryObject)

    //sorting

    let sorting = ""

    if (typeof sort === "string" && sort.trim().length > 0) {
      const validFields = [
        "name",
        "difficulty",
        "updatedAt",
        "createdAt",
        "price",
      ] // Define valid fields
      const sortFields = sort
        .split(",")
        .filter((field) => validFields.includes(field.replace("-", "")))

      sorting = sortFields.join(" ")
      if (sorting) {
        apiData = apiData.sort(sorting)
      }
    } else {
      // Default sorting, e.g., by createdAt in descending order
      apiData = apiData.sort("-createdAt")
    }

    let page = Number(req.query.page) || 1
    let limit = Number(req.query.limit) || 10
    let skip = (page - 1) * limit

    apiData = apiData.skip(skip).limit(limit)

    const totalTrekCount = await Tour.countDocuments(queryObject)

    // Calculate total pages
    const totalPages = Math.ceil(totalTrekCount / limit)

    const tour = await apiData

    if (!tour) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No tour found",
      })
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Tour found",
      data: tour,
      totalPages,
      nbhits: tour.length,
    })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    })
  }
}

export default getAllTours