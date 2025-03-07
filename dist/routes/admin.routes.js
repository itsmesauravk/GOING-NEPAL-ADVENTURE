import express from "express";
import { adminProfile, editAdmin, forgotPassword, getFullAdminProfile, loginAdmin, logoutAdmin, registerAdmin, resetPassword, updateAccessToken, updatePassword, validateToken, verifyOtp, } from "../controllers/admin/admin.controller.js";
import auth from "../middlewares/auth.js";
const router = express.Router();
//routes
router.post("/admin-register", async (req, res) => {
    registerAdmin(req, res);
});
router.post("/login", async (req, res) => {
    loginAdmin(req, res);
});
router.post("/logout", async (req, res) => {
    logoutAdmin(req, res);
});
router.get("/profile", async (req, res) => {
    adminProfile(req, res);
});
router.post("/validate", async (req, res) => {
    validateToken(req, res);
});
router.post("/refresh-token", async (req, res) => {
    updateAccessToken(req, res);
});
router.get("/my-account/:id", getFullAdminProfile);
router.patch("/update", editAdmin);
router.patch("/update-password", auth, updatePassword);
//forgot password
router.post("/forgot-password", forgotPassword);
//verifyotp
router.post("/verify", verifyOtp);
//reset password
router.post("/reset-password", resetPassword);
// export router
export default router;
