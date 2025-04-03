import express from "express"
import { getCountDetails } from "../controllers/home/home.controller.js"
import globalSearch from "../controllers/home/globalSearch.controller.js"
import { adminProfile } from "../controllers/admin/admin.controller.js"

const router = express.Router()

// routes
router.get("/get-count-details", getCountDetails)
router.get("/search-global", globalSearch)

//admin profile
router.get("/profile", adminProfile)

// router.get("/profile", async (req, res) => {
//     adminProfile(req, res)
// //   })

export default router
