import Admin from "../models/admin.model.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
const auth = async (req, res, next) => {
    try {
        // Extract the token from Authorization header or cookies
        const token = req.header("Authorization")?.split(" ")[1] || req.cookies.token;
        if (!token) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized access. Token missing.",
            });
            return;
        }
        // Verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
        // Find the admin using the decoded token's ID
        const admin = await Admin.findById(decodedToken.id).exec();
        if (!admin) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized access. Admin not found.",
            });
            return;
        }
        // Attach admin to the request object
        req.admin = admin;
        // Proceed to the next middleware
        next();
    }
    catch (error) {
        console.error("Authentication error:", error);
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Invalid token.",
            });
            return;
        }
        if (error instanceof jwt.TokenExpiredError) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Token expired.",
            });
            return;
        }
        res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: "Unauthorized access. Invalid or expired token.",
        });
    }
};
export default auth;
