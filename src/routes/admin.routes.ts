import express from "express"
import {
  loginAdmin,
  logoutAdmin,
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

router.post("/logout", async (req, res) => {
  logoutAdmin(req, res)
})

export default router
