import express from "express";
import { addBookingPrice, createBooking, deleteBooking, deleteBookingPrice, getBooking, getSingleBookingPrice, updateBookingPrice, viewSingle, } from "../controllers/bookings/index.js";
const bookingRouter = express.Router();
bookingRouter.post("/create", createBooking);
bookingRouter.get("/get-all", getBooking);
bookingRouter.delete("/delete/:id", deleteBooking);
bookingRouter.get("/view/:id", viewSingle);
//for booking prices
bookingRouter.post("/add-booking-price", addBookingPrice);
bookingRouter.put("/update-booking-price", updateBookingPrice);
bookingRouter.delete("/delete-booking-price/:id", deleteBookingPrice);
bookingRouter.get("/get-single-booking-price/:adventureId/:adventureType", getSingleBookingPrice);
export { bookingRouter };
