import { StatusCodes } from "http-status-codes";
import Activity from "../../../models/activities.model.js";
// Update  visibility
const editActivityVisibility = async (req, res) => {
    try {
        const { activityId } = req.params;
        // const { isNewItem } = req.body
        if (!activityId || !req.body) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Data is Invalid",
                error: "Invalid data",
            });
            return;
        }
        const activity = await Activity.findByIdAndUpdate(activityId, req.body, {
            new: true,
        });
        if (!activity) {
            res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Activity not found",
                error: `activity not found with id: ${activityId}`,
            });
            return;
        }
        res
            .status(StatusCodes.OK)
            .json({ success: true, message: "Activity visibility updated" });
    }
    catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
export default editActivityVisibility;
