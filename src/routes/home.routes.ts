import express from "express"
import { getCountDetails } from "../controllers/home/home.controller.js"

const router = express.Router()

import auth from "../middlewares/auth.js"

// routes
router.get("/get-count-details", auth, getCountDetails)

export default router
