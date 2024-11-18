import { Request, Response } from "express"
import Trekking from "../../../models/trekking.model.js"
import { StatusCodes } from "http-status-codes"
import { QueryObjectType } from "../../../utils/types.js"

// Getting all treks with all the filtration, sorting and pagination
const getTrek = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { search } = req.query

    const queryObject: QueryObjectType = {}

    if (search) {
      queryObject.name = { $regex: search, $options: "i" } as any
    }

    let apiData = Trekking.find(queryObject)

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
