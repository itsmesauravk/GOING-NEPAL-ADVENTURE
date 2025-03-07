import Activity from "../../../models/activities.model.js";
import { StatusCodes } from "http-status-codes";
import { deleteImage } from "../../../utils/cloudinary.js";
// delete by slug
const deleteActivity = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Id is required",
            });
        }
        const activity = await Activity.findById(id);
        if (!activity) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Activity not found",
            });
        }
        // delete thumbnail
        if (activity.thumbnail) {
            await deleteImage(activity.thumbnail);
        }
        // delete gallery images
        if (activity.gallery && activity.gallery.length > 0) {
            for (const image of activity.gallery) {
                await deleteImage(image);
            }
        }
        const deletedActivity = await Activity.findByIdAndDelete(id);
        if (!deletedActivity) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Activity not deleted",
            });
        }
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Activity deleted successfully",
        });
    }
    catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};
export default deleteActivity;
