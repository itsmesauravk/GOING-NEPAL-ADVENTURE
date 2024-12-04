import express from "express"
import { createRequest } from "../controllers/planTrip/index.js"
const router = express.Router()

//routes
router.post("/create-request", (req, res) => {
  createRequest(req, res)
})

export default router
