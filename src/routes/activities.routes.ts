import express from "express"
const router = express.Router()
import uploader from "../utils/multer.js"

import {
  createActivity,
  deleteActivity,
  getActivities,
} from "../controllers/activities/index.js"
import getSingleActivity from "../controllers/activities/sub-controller/getSingleActivity.controller.js"

const uploadFields = [
  { name: "thumbnail", maxCount: 1 },
  { name: "image", maxCount: 10 },
  { name: "video", maxCount: 1 },
]

interface MulterRequest extends express.Request {
  files: {
    thumbnail?: Express.Multer.File[]
    image?: Express.Multer.File[]
    video?: Express.Multer.File[]
  }
}

router.post(
  "/create-activity",
  uploader.fields(uploadFields),
  async (req, res) => {
    await createActivity(req as MulterRequest, res)
  }
)

router.get("/get-activities", async (req, res) => {
  await getActivities(req, res)
})

router.get("/get-activity-by-slug/:slug", async (req, res) => {
  await getSingleActivity(req, res)
})

router.delete("/delete-activity/:id", async (req, res) => {
  await deleteActivity(req, res)
})

export default router
