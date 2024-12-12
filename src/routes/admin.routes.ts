import express from "express"
import {
  loginAdmin,
  registerAdmin,
} from "../controllers/admin/admin.controller.js"

const router = express.Router()

//routes
router.post("/admin-register", async (req, res) => {
  registerAdmin(req, res)
})

router.post("/login", async (req, res) => {
  loginAdmin(req, res)
})

export default router
