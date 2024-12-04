import express from "express"
import {
  createRequest,
  getSingleTripRequest,
  getTripRequests,
} from "../controllers/planTrip/index.js"
const router = express.Router()

//routes
router.post("/create-request", (req, res) => {
  createRequest(req, res)
})
router.get("/get-trip-requests", (req, res) => {
  getTripRequests(req, res)
})
router.get("/get-single-trip-request/:requestId", (req, res) => {
  getSingleTripRequest(req, res)
})

export default router
