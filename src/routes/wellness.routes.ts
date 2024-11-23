import express from "express"
import {
  addWellness,
  getAllWellness,
  getWellnessBySLug,
  editWellnessVisibility,
} from "../controllers/wellness/index.js"
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
  "/add-wellness",
  uploader.fields(uploadFields),
  async (req, res, next) => {
    try {
      await addWellness(req as MulterRequest, res)
    } catch (error) {
      next(error)
    }
  }
)

// // get all wellness + filter + pagination + sorting
router.get("/all-wellness", async (req, res, next) => {
  try {
    await getAllWellness(req as MulterRequest, res)
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

//get wellness by slug
router.get("/get-wellness/:slug", async (req, res, next) => {
  try {
    await getWellnessBySLug(req as MulterRequest, res)
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

// Update wellness visibility
router.patch(
  "/edit-wellness-visibility/:wellnessId",
  async (req, res, next) => {
    try {
      await editWellnessVisibility(req as MulterRequest, res)
    } catch (error) {
      next(error)
    }
  }
)

// Export the router
export default router
