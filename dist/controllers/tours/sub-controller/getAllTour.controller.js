import Tour from "../../../models/tour.model.js";
import { StatusCodes } from "http-status-codes";
// Getting all tours with all the filtration, sorting and pagination
const getAllTours = async (req, res) => {
    try {
        const { country, search, tripType, sort, visibility, excludeId, region } = req.query;
        const queryObject = {};
        if (country) {
            queryObject.country = country;
        }
        if (tripType) {
            queryObject.tripType = tripType;
        }
        if (search) {
            queryObject.name = { $regex: search, $options: "i" };
        }
        // if (visibility && typeof visibility === "string") {
        //   queryObject[visibility] = "true" as string
        // }
        if (visibility === "all") {
            // No additional filter admin want to see all treks
        }
        else if (visibility === "isActivated" ||
            visibility === "isPopular" ||
            visibility === "isNewItem" ||
            visibility === "isFeatured") {
            queryObject[visibility] = "true";
        }
        else if (visibility === "notActivated") {
            queryObject.isActivated = "false";
        }
        else if (visibility === "notPopular") {
            queryObject.isPopular = "false";
        }
        else if (visibility === "notNewItem") {
            queryObject.isNewItem = "false";
        }
        else if (visibility === "notFeatured") {
            queryObject.isFeatured = "false";
        }
        else {
            // default: only show activated treks
            queryObject.isActivated = "true";
        }
        if (excludeId) {
            queryObject._id = { $ne: excludeId };
        }
        if (region) {
            queryObject.location = region;
        }
        let apiData = Tour.find(queryObject);
        //sorting
        let sorting = "";
        if (typeof sort === "string" && sort.trim().length > 0) {
            const validFields = [
                "name",
                "difficulty",
                "updatedAt",
                "createdAt",
                "price",
                "days.max",
                "days.min",
            ]; // Define valid fields
            const sortFields = sort
                .split(",")
                .filter((field) => validFields.includes(field.replace("-", "")));
            sorting = sortFields.join(" ");
            if (sorting) {
                apiData = apiData.sort(sorting);
            }
        }
        else {
            // Default sorting, e.g., by createdAt in descending order
            apiData = apiData.sort("-createdAt");
        }
        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 10;
        let skip = (page - 1) * limit;
        apiData = apiData.skip(skip).limit(limit);
        const totalTrekCount = await Tour.countDocuments(queryObject);
        // Calculate total pages
        const totalPages = Math.ceil(totalTrekCount / limit);
        const tour = await apiData;
        if (!tour) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "No tour found",
            });
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Tour found",
            data: tour,
            totalPages,
            nbhits: tour.length,
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
export default getAllTours;
