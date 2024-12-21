import express from "express"
const router = express.Router()

import {
  deleteUserDetails,
  getUserDetails,
} from "../controllers/userInfo/userInfo.controller.js"

router.get("/get", async (req, res) => {
  await getUserDetails(req, res)
})

router.delete("/delete/:id", deleteUserDetails)

export default router
