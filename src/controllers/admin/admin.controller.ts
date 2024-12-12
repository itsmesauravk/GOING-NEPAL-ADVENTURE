import Admin from "../../models/admin.model.js"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import bcrypt from "bcrypt"

//create admin

const generateAccessAndRefreshTokens = async (admin: any) => {
  try {
    const accessToken = await admin.generateAccessToken()
    const refreshToken = await admin.generateRefreshToken()

    admin.refreshToken = refreshToken
    await admin.save()

    return { accessToken, refreshToken }
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const registerAdmin = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body

    if (!fullName || !email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Please provide all required fields",
      })
    }

    const admin = new Admin({
      fullName,
      email,
      password,
    })

    await admin.save()

    if (!admin) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Unable to register Admin",
      })
    }

    const registredAdmin = await Admin.findById(admin._id).select(
      "_id fullName email createdAt"
    )

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Admin registered successfully",
      data: registredAdmin,
    })
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Internal server error",
    })
  }
}

const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Please provide all required fields",
      })
    }

    const admin = await Admin.findOne({ email })
    if (!admin)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Invalid Credientals" })

    const validatePassword = await bcrypt.compare(password, admin.password)

    if (!validatePassword)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: "Invalid Credientals" })

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      admin
    )

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
      })
      .status(StatusCodes.OK)
      .json({
        success: true,
        message: "Admin logged in successfully",
        accessToken,
        refreshToken,
      })
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Internal server error",
    })
  }
}

const logoutAdmin = async (req: Request, res: Response) => {
  try {
    res
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
      })
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
      })

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Admin logged out successfully",
    })
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Internal server error",
    })
  }
}

export { registerAdmin, loginAdmin, logoutAdmin }
