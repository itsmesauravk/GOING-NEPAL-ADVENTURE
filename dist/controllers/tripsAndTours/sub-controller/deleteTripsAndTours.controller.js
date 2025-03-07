import TripsAndTours from "../../../models/tripsAndTours.model.js";
import { StatusCodes } from "http-status-codes";
const deleteTripsAndTours = async (req, res) => {
    try {
        const { id } = req.params;
        const trip = await TripsAndTours.findById(id);
        if (!trip) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ success: false, message: "Trip Not Found" });
        }
        if (trip.totalTours > 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Cannot Delete, This category contains Tours.",
            });
        }
        await trip.deleteOne();
        return res
            .status(StatusCodes.OK)
            .json({ success: true, message: "Trip Deleted Successfully" });
    }
    catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ success: false, message: error.message });
    }
};
export default deleteTripsAndTours;
