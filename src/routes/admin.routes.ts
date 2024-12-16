import express from "express"
import {
  adminProfile,
  loginAdmin,
  logoutAdmin,
  registerAdmin,
  updateAccessToken,
  validateToken,
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

router.get("/profile", async (req, res) => {
  adminProfile(req, res)
})

router.post("/validate", async (req, res) => {
  validateToken(req, res)
})

router.post("/refresh-token", async (req, res) => {
  updateAccessToken(req, res)
})

export default router
