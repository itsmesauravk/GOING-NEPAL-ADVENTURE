import Trekking from "../../../models/trekking.model.js";
import { StatusCodes } from "http-status-codes";
// Update trek visibility
const editTrekVisibility = async (req, res) => {
    try {
        const { trekId } = req.params;
        // const { isNewItem } = req.body
        if (!trekId || !req.body) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Data is Invalid",
                error: "Invalid data",
            });
        }
        const trek = await Trekking.findByIdAndUpdate(trekId, req.body, {
            new: true,
        });
        if (!trek) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Trek not found",
                error: `Trek not found with id: ${trekId}`,
            });
        }
        return res
            .status(StatusCodes.OK)
            .json({ success: true, message: "Trek visibility updated", data: trek });
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
export default editTrekVisibility;
