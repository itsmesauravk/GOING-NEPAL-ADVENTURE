import express from "express"
const router = express.Router()

import {
  createRequest,
  getPendingCount,
  getRequests,
  sendSingleMail,
} from "../controllers/quoteAndCustomize/index.js"
import getSingleRequest from "../controllers/quoteAndCustomize/sub-controller/getSingleRequest.js"

import uploader from "../utils/multer.js"

interface MulterRequest extends express.Request {
  files: {
    attachments: Express.Multer.File[]
  }
}

const uploadFields = [{ name: "attachments", maxCount: 5 }]

// routes
router.post("/create", (req, res) => {
  createRequest(req, res)
})
router.get("/get", (req, res) => {
  getRequests(req, res)
})

router.get("/get-counts", (req, res) => {
  getPendingCount(req, res)
})

router.get("/get-single/:id", (req, res) => {
  getSingleRequest(req, res)
})

router.post(
  "/send-single-mail/:id",
  uploader.fields(uploadFields),
  (req, res) => {
    sendSingleMail(req as MulterRequest, res)
  }
)

export default router
