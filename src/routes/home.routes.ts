import express from "express"
import { getCountDetails } from "../controllers/home/home.controller.js"
const router = express.Router()

// routes
router.get("/get-count-details", (req, res) => {
  getCountDetails(req, res)
})

export default router
