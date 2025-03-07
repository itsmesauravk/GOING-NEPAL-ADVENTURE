import Wellness from "../../../models/wellness.model.js";
import { StatusCodes } from "http-status-codes";
// Getting all wellness with all the filtration, sorting and pagination
const getAllWellness = async (req, res) => {
    try {
        const { country, search, sort, visibility } = req.query;
        const queryObject = {};
        if (country) {
            queryObject.country = country;
        }
        if (search && typeof search === "string") {
            queryObject.name = { $regex: search, $options: "i" };
        }
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
        let apiData = Wellness.find(queryObject);
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
        const totalTrekCount = await Wellness.countDocuments(queryObject);
        // Calculate total pages
        const totalPages = Math.ceil(totalTrekCount / limit);
        const wellness = await apiData;
        if (!wellness) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "No Wellness found",
            });
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Wellness found",
            data: wellness,
            totalPages,
            nbhits: wellness.length,
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
export default getAllWellness;
