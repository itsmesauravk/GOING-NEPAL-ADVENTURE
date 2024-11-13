import { Request, Response } from "express"
import Trekking from "../../../models/trekking.model.js"
import { StatusCodes } from "http-status-codes"
import { QueryObjectType } from "../../../utils/types.js"

// Getting all treks with all the filtration, sorting and pagination
const getTrek = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { location } = req.query

    const queryObject: QueryObjectType = {}

    if (location) {
      queryObject.location = location as string
    }

    let apiData = Trekking.find(queryObject)

    let page = Number(req.query.page) || 1
    let limit = Number(req.query.limit) || 5
    let skip = (page - 1) * limit

    apiData = apiData.skip(skip).limit(limit)

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
