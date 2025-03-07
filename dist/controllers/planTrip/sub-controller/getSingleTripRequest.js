import PlanTrip from "../../../models/planTrip.model.js";
import { StatusCodes } from "http-status-codes";
const getSingleTripRequest = async (req, res) => {
    try {
        let tripRequest = await PlanTrip.findById(req.params.requestId);
        if (!tripRequest) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Plan Trip request not found",
            });
        }
        if (tripRequest.status === "pending") {
            await PlanTrip.findByIdAndUpdate(req.params.requestId, {
                status: "viewed",
            });
        }
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Request found",
            data: tripRequest,
        });
    }
    catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
export default getSingleTripRequest;
