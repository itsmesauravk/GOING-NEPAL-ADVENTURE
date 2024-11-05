import express from "express"
import healthCheck from "../../health-check/healthcheck.js"

const router = express.Router()

router.get("/health", healthCheck)

export default router
