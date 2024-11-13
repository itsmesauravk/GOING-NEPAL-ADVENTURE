import express from "express"
import {
  addTrek,
  getSingleTrek,
  getTrek,
} from "../controllers/trekking/index.js"
import uploader from "../utils/multer.js"

// Add these type definitions
interface MulterRequest extends express.Request {
  files: {
    thumbnail?: Express.Multer.File[]
    images?: Express.Multer.File[]
    video?: Express.Multer.File[]
  }
}

const router = express.Router()

const uploadFields = [
  { name: "thumbnail", maxCount: 1 },
  { name: "images", maxCount: 10 },
  { name: "video", maxCount: 1 },
]

//
router.post(
  "/add-trek",
  uploader.fields(uploadFields),
  async (req, res, next) => {
    try {
      await addTrek(req as MulterRequest, res)
    } catch (error) {
      next(error)
    }
  }
)

// get all trek + filter + pagination + sorting
router.get("/treks", async (req, res, next) => {
  try {
    await getTrek(req as MulterRequest, res)
  } catch (error) {
    next(error)
  }
})

// get single trek
router.get("/trek/:id", async (req, res, next) => {
  try {
    await getSingleTrek(req as MulterRequest, res)
  } catch (error) {
    next(error)
  }
})

// Export the router

export default router
