import Tour from "../../../models/tour.model.js";
import { StatusCodes } from "http-status-codes";
// Getting single tour by slug
const getTourBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;
        const tour = await Tour.findOne({ slug });
        if (!tour) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "No trek found",
            });
        }
        if (tour) {
            tour.viewsCount += 1;
            await tour.save();
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Tour found",
            data: tour,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
export default getTourBySlug;
