import { Booking } from "../../../models/booking.model.js";
import { StatusCodes } from "http-status-codes";
const getBooking = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort, adventureTypeSort } = req.query;
        // console.log(req.query)
        // Pagination
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 10;
        const skip = (pageNumber - 1) * limitNumber;
        // Sorting logic
        let sortOption = { status: 1, createdAt: -1 }; // Default:pending & Newest First
        if (sort === "oldest")
            sortOption = { createdAt: 1 };
        else if (sort === "fullName")
            sortOption = { fullName: 1 };
        else if (sort === "-fullName")
            sortOption = { fullName: -1 };
        else if (sort === "totalPrice")
            sortOption = { totalPrice: 1 };
        else if (sort === "-totalPrice")
            sortOption = { totalPrice: -1 };
        else if (sort === "bookingDate")
            sortOption = { bookingDate: 1 };
        else if (sort === "-bookingDate")
            sortOption = { bookingDate: -1 };
        // Filtering by adventure type (if provided)
        const filter = {};
        if (adventureTypeSort && adventureTypeSort !== "all") {
            filter.adventureType = adventureTypeSort;
        }
        // Fetching bookings with applied filters, sorting, and pagination
        const bookings = await Booking.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNumber);
        // Total count for pagination
        const totalBookings = await Booking.countDocuments(filter);
        const totalPages = Math.ceil(totalBookings / limitNumber);
        if (!bookings.length) {
            res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "No Bookings Found",
            });
            return;
        }
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Bookings Found",
            data: bookings,
            totalPages,
        });
    }
    catch (error) {
        console.log("Get Bookings error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
        });
    }
};
export { getBooking };
