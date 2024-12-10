import express from "express"
const router = express.Router()

import {
  createRequest,
  getPendingCount,
  getRequests,
} from "../controllers/quoteAndCustomize/index.js"

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

export default router
