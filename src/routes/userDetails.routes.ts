import express from "express"
const router = express.Router()

import { getUserDetails } from "../controllers/userInfo/userInfo.controller.js"

router.get("/get", async (req, res) => {
  await getUserDetails(req, res)
})

export default router
