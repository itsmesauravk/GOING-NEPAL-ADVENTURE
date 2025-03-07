import Activity from "../../../models/activities.model.js";
import { StatusCodes } from "http-status-codes";
// Get all activities
const getActivities = async (req, res) => {
    try {
        const { sort, search, visibility } = req.query;
        const queryObject = {};
        // Search filter
        if (search) {
            queryObject.title = { $regex: search, $options: "i" };
        }
        // Visibility handling
        if (visibility === "all") {
            // If admin wants to see all activities (both activated and not)
            // No additional filter
        }
        else if (visibility === "isActivated" || visibility === "isPopular") {
            // Default or specific visibility filter
            queryObject[visibility] = "true";
        }
        else if (visibility === "notActivated") {
            queryObject.isActivated = "false";
        }
        else if (visibility === "notPopular") {
            queryObject.isPopular = "false";
        }
        else {
            // Default: only show activated activities
            queryObject.isActivated = "true";
        }
        // Sorting
        let activitiesQuery = Activity.find(queryObject);
        if (sort && typeof sort === "string") {
            const sorting = sort.split(",").join(" ");
            activitiesQuery = activitiesQuery.sort(sorting);
        }
        // Pagination
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.max(Number(req.query.limit) || 10, 1);
        const skip = (page - 1) * limit;
        activitiesQuery = activitiesQuery.skip(skip).limit(limit);
        // Fetch data
        const activities = await activitiesQuery;
        if (activities.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "No Activities Found",
            });
        }
        res.status(StatusCodes.OK).json({
            success: true,
            data: activities,
        });
    }
    catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};
export default getActivities;
