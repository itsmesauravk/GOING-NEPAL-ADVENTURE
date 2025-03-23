import { createBooking } from "./sub-controller/createBooking.controller.js"
import { getBooking } from "./sub-controller/getAll.controller.js"
import { deleteBooking } from "./sub-controller/delete.controller.js"
import { viewSingle } from "./sub-controller/viewSingle.js"
import {
  addBookingPrice,
  updateBookingPrice,
  deleteBookingPrice,
  getSingleBookingPrice,
} from "./sub-controller/bookingPrice.controller.js"

export {
  createBooking,
  getBooking,
  deleteBooking,
  viewSingle,
  addBookingPrice,
  updateBookingPrice,
  deleteBookingPrice,
  getSingleBookingPrice,
}
