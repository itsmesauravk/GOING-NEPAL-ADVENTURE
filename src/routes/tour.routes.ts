import express from "express"
import {
  addTour,
  getAllTours,
  getTourBySlug,
} from "../controllers/tours/index.js"
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
  "/add-tour",
  uploader.fields(uploadFields),
  async (req, res, next) => {
    try {
      await addTour(req as MulterRequest, res)
    } catch (error) {
      next(error)
    }
  }
)

// // get all tour + filter + pagination + sorting
router.get("/tours", async (req, res, next) => {
  try {
    await getAllTours(req as MulterRequest, res)
  } catch (error) {
    next(error)
  }
})

// // get single trek
// router.get("/trek/:id", async (req, res, next) => {
//   try {
//     await getSingleTrek(req as MulterRequest, res)
//   } catch (error) {
//     next(error)
//   }
// })

//get trek by slug
router.get("/get-tour/:slug", async (req, res, next) => {
  try {
    await getTourBySlug(req as MulterRequest, res)
  } catch (error) {
    next(error)
  }
})

// // delete trek
// router.delete("/delete-tour/:id", async (req, res, next) => {
//   try {
//     await deleteTrek(req as MulterRequest, res)
//   } catch (error) {
//     next(error)
//   }
// })

// Export the router
export default router