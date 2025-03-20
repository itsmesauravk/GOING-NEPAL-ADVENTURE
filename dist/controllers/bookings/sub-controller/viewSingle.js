import { Booking } from "../../../models/booking.model.js";
import { StatusCodes } from "http-status-codes";
const viewSingle = async (req, res) => {
    try {
        const bookingId = req.params.id;
        if (!bookingId) {
            res
                .status(StatusCodes.BAD_REQUEST)
                .json({ success: false, message: "Booking Id is required" });
            return;
        }
        const singleRequest = await Booking.findById(bookingId);
        if (!singleRequest) {
            res
                .status(StatusCodes.NOT_FOUND)
                .json({ success: false, message: "Request Not Found" });
            return;
        }
        singleRequest.status = "viewed";
        await singleRequest.save();
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Booking Request Found",
            data: singleRequest,
        });
    }
    catch (error) {
        console.log("View Single Bookings error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
        });
    }
};
export { viewSingle };
