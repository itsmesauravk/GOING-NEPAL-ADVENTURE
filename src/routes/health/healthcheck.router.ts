import express from "express"
import healthCheck from "../../health-check/healthcheck"

const router = express.Router()

router.get("/health", healthCheck)

export default router
