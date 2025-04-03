import express from "express"
import { getCountDetails } from "../controllers/home/home.controller.js"
import globalSearch from "../controllers/home/globalSearch.controller.js"

const router = express.Router()

// routes
router.get("/get-count-details", getCountDetails)
router.get("/search-global", globalSearch)

export default router
