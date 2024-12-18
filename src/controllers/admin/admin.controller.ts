import Admin from "../../models/admin.model.js"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

//create admin

interface DecodedToken {
  id: string
  email: string
}

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
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Please provide all required fields",
      })
    }

    const admin = await Admin.findOne({ email })
    if (!admin)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: "Invalid Credientals" })

    const validatePassword = await bcrypt.compare(password, admin.password)

    if (!validatePassword)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: "Invalid Credientals" })

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      admin
    )

    res.status(StatusCodes.OK).json({
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

const adminProfile = async (req: Request, res: Response) => {
  try {
    const token =
      req.header("Authorization")?.split(" ")[1] || req.cookies.accessToken

    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized access. Token missing.",
      })
    }

    const { s } = req.query

    let selected
    if (s === "a") {
      selected = "-password"
    } else {
      selected = "_id fullName email createdAt"
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET as string
    ) as DecodedToken
    const admin = await Admin.findById(decodedToken.id).select(selected)

    if (!admin) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Admin not found",
      })
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: admin,
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
        // httpOnly: true,
        // secure: true,
        // sameSite: "none",
      })
      .clearCookie("refreshToken", {
        // httpOnly: true,
        // secure: true,
        // sameSite: "none",
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

const updateAccessToken = async (req: Request, res: Response) => {
  try {
    const token =
      req.cookies.accessToken || req.header("Authorization")?.split(" ")[1]
    const oldRefreshToken =
      req.cookies.refreshToken || req.header("Authorization")?.split(" ")[2]
    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized access. Token missing.",
      })
    }
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET as string
    ) as DecodedToken

    const admin = await Admin.findById(decodedToken.id)

    if (!admin) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Admin not found",
      })
    }

    if (admin.refreshToken !== oldRefreshToken) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized access",
      })
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      admin
    )

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Access token updated successfully",
      accessToken,
      refreshToken,
    })

    //
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Internal server error",
    })
  }
}

const validateToken = async (req: Request, res: Response) => {
  try {
    const token =
      req.cookies.token || req.header("Authorization")?.split(" ")[1]

    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized access. Token missing.",
      })
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET as string
    ) as DecodedToken

    const admin = await Admin.findById(decodedToken.id)

    if (!admin) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Admin not found",
      })
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Token is valid",
    })
  } catch (error: any) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: error.message || "Invalid or expired token",
    })
  }
}

const getFullAdminProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const adminId = req.params.id
    if (!adminId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Please provide Admin ID",
      })
      return
    }
    const admin = await Admin.findById(adminId).select("-password")

    if (!admin) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Admin not found",
      })
      return
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: admin,
    })
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Internal server error",
    })
  }
}

export {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  adminProfile,
  updateAccessToken,
  validateToken,
  getFullAdminProfile,
}
