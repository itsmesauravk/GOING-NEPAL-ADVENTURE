import express from "express"
import {
  addTrek,
  getSingleTrek,
  getTrek,
  deleteTrek,
  getTrekBySlug,
  editTrekVisibility,
} from "../controllers/trekkings/index.js"
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
  { name: "trekPdf", maxCount: 1 },
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

//get trek by slug
router.get("/get-trek/:slug", async (req, res, next) => {
  try {
    await getTrekBySlug(req as MulterRequest, res)
  } catch (error) {
    next(error)
  }
})

// delete trek
router.delete("/delete-trek/:trekId", async (req, res, next) => {
  try {
    await deleteTrek(req as MulterRequest, res)
  } catch (error) {
    next(error)
  }
})

// edit trek visibility
router.patch("/edit-trek-visibility/:trekId", async (req, res, next) => {
  try {
    await editTrekVisibility(req as MulterRequest, res)
  } catch (error) {
    next(error)
  }
})

// Export the router
export default router
