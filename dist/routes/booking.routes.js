import express from "express";
import { addBookingPrice, createBooking, deleteBooking, deleteBookingPrice, getBooking, getSingleBookingPrice, sendBookingMail, updateBookingPrice, viewSingle, } from "../controllers/bookings/index.js";
import uploader from "../utils/multer.js";
const uploadFields = [{ name: "attachments", maxCount: 5 }];
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
bookingRouter.post("/send-booking-mail/:id", uploader.fields(uploadFields), (req, res) => {
    sendBookingMail(req, res);
});
export { bookingRouter };
