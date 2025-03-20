import express from "express"

import {
  createBooking,
  deleteBooking,
  getBooking,
  viewSingle,
} from "../controllers/bookings/index.js"

const bookingRouter = express.Router()

bookingRouter.post("/create", createBooking)
bookingRouter.get("/get-all", getBooking)
bookingRouter.delete("/delete/:id", deleteBooking)
bookingRouter.get("/view/:id", viewSingle)

export { bookingRouter }
