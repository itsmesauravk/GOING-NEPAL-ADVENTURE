import { Booking } from "../../../models/booking.model.js";
import { StatusCodes } from "http-status-codes";
const getBooking = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort, adventureType } = req.query;
        // Pagination
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 10;
        const skip = (pageNumber - 1) * limitNumber;
        // Sorting logic
        let sortOption = { createdAt: -1 }; // Default: Newest First
        if (sort === "oldest")
            sortOption = { createdAt: 1 };
        else if (sort === "nameAsc")
            sortOption = { email: 1 };
        else if (sort === "nameDesc")
            sortOption = { email: -1 };
        else if (sort === "priceAsc")
            sortOption = { totalPrice: 1 };
        else if (sort === "priceDesc")
            sortOption = { totalPrice: -1 };
        else if (sort === "bookingDateAsc")
            sortOption = { bookingDate: 1 };
        else if (sort === "bookingDateDesc")
            sortOption = { bookingDate: -1 };
        // Filtering by adventure type (if provided)
        const filter = {};
        if (adventureType && adventureType !== "all") {
            filter.adventureType = adventureType;
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
