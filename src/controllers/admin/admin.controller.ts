import Admin from "../../models/admin.model.js"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { AdminDocument } from "../../utils/types.js"
import { otpMailContent, otpSubject } from "../../utils/mailContent.js"
import { sendSingleEmail } from "../../utils/nodemailer.js"

//create admin

interface DecodedToken {
  id: string
  email: string
}

// Define a custom interface extending the Express Request
interface CustomRequest extends Request {
  user?: AdminDocument // Replace 'any' with the actual type of user if known
}

// const generateAccessAndRefreshTokens = async (admin: any) => {
//   try {
//     const accessToken = await admin.generateAccessToken()
//     const refreshToken = await admin.generateRefreshToken()

//     admin.refreshToken = refreshToken
//     await admin.save()

//     return { accessToken, refreshToken }
//   } catch (error) {
//     let errorMessage = "Internal Server Error"
//     if (error instanceof Error) {
//       errorMessage = error.message
//     }
//     throw new Error(errorMessage)
//   }
// }

// Generate access and refresh tokens

const generateAccessAndRefreshTokens = async (admin: any) => {
  try {
    const payload = { id: admin._id, email: admin.email }

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: Number(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN) || "1h",
      }
    )

    const refreshToken = jwt.sign(
      { id: admin._id },
      process.env.JWT_REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: Number(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN) || "7d",
      }
    )

    // Save refresh token to database
    admin.refreshToken = refreshToken
    await admin.save()

    return { accessToken, refreshToken }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Internal Server Error"
    )
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
  } catch (error) {
    let errorMessage = "Internal Server Error"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: errorMessage,
    })
  }
}

const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Please provide all required fields",
      })
      return
    }

    const admin = await Admin.findOne({ email })
    if (!admin) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: "Invalid Credientals" })
      return
    }

    //check if account is locked
    if (admin.failedLoginAttempts >= 5) {
      const currentTime = new Date()
      const lastFailedLoginAt = admin.lastFailedLoginAt
      if (lastFailedLoginAt) {
        const diff = Math.abs(
          currentTime.getTime() - lastFailedLoginAt.getTime()
        )
        const diffInMinutes = Math.ceil(diff / (1000 * 60))
        console.log("time difference : ", diffInMinutes)
        if (diffInMinutes <= 10) {
          res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: `Your account has been locked temporary for 10 min. Please try again after 10 min.`,
          })
          return
        } else {
          admin.failedLoginAttempts = 0
          await admin.save()
        }
      }
    }

    //validating password
    const validatePassword = await bcrypt.compare(password, admin.password)

    if (admin.failedLoginAttempts >= 5 && !validatePassword) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message:
          "Your account has been locked temporary for 10 min. Please try again after 10 min.",
      })
      return
    }

    if (!validatePassword) {
      admin.failedLoginAttempts += 1
      admin.lastFailedLoginAt = new Date()
      await admin.save()
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: `Invalid Credential, Login Attempt left ${
          5 - admin.failedLoginAttempts
        } times.`,
      })
      return
    }

    admin.failedLoginAttempts = 0
    admin.lastLoginAt = new Date()
    admin.lastLoginIP = req.ip || "unknown"
    admin.loginHistory.push({ ip: admin.lastLoginIP, timestamp: new Date() })
    await admin.save()

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      admin
    )

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Admin logged in successfully",
      accessToken,
      refreshToken,
    })
  } catch (error) {
    let errorMessage = "Internal Server Error"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: errorMessage || "Internal server error",
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
  } catch (error) {
    let errorMessage = "Internal Server Error"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: errorMessage,
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
  } catch (error) {
    let errorMessage = "Internal Server Error"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: errorMessage,
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
  } catch (error) {
    let errorMessage = "Internal Server Error"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: errorMessage,
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
  } catch (error) {
    let errorMessage = "Internal Server Error"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: errorMessage,
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
  } catch (error) {
    let errorMessage = "Internal Server Error"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: errorMessage,
    })
  }
}

const editAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract token
    const token =
      req.cookies?.token || req.header("Authorization")?.split(" ")[1]
    if (!token) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Authentication token is missing",
      })
      return
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET as string
    ) as DecodedToken

    // Validate request body
    const { fullName, phoneNumber } = req.body

    if (!fullName || !phoneNumber) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Please provide all required fields",
      })

      return
    }

    // Check if admin exists
    const existingAdmin = await Admin.findById(decoded.id)
    if (!existingAdmin) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Admin not found",
      })
      return
    }

    // Update fields
    const updatedAdmin = await Admin.findByIdAndUpdate(
      decoded.id,
      {
        $set: { fullName: fullName, phoneNumber: phoneNumber },
      },
      { new: true }
    )

    if (!updatedAdmin) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Unable to update admin",
      })
      return
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Admin updated successfully",
      data: updatedAdmin,
    })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error"
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: errorMessage,
    })
  }
}
//update password from profile
const updatePassword = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const token =
      req.cookies.accessToken || req.header("Authorization")?.split(" ")[1]
    const { oldPassword, newPassword } = req.body

    // Validate request body
    if (!oldPassword || !newPassword) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Please provide all required fields",
      })
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET as string
    ) as DecodedToken

    // Find admin
    const admin = await Admin.findById(decoded.id)
    if (!admin) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Admin not found",
      })
      return
    }

    // Validate old password
    const validatePassword = await bcrypt.compare(oldPassword, admin.password)
    if (!validatePassword) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid old password",
      })
      return
    }

    // Update password
    admin.password = newPassword
    await admin.save()

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Password updated successfully",
    })
  } catch (error) {
    let errorMessage = "Internal Server Error"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: errorMessage,
    })
  }
}

// forgot password cases
const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body
  try {
    const admin = await Admin.findOne({ email })
    if (!admin) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Account not found",
      })
      return
    }

    // Generate token
    const verifyToken = jwt.sign(
      { id: admin._id },
      process.env.JWT_ACCESS_TOKEN_SECRET as string,
      { expiresIn: "10m" }
    )

    //generate opt and send to email
    const opt = Math.floor(1000 + Math.random() * 9000) // 4 digit random number
    //send otp to email
    const verificationLink = `${process.env.CLIENT_URL}/verify/t?${verifyToken}`
    const mailContent = otpMailContent({
      otp: opt.toString(),
      verificationLink,
    })
    //send mail
    sendSingleEmail(email, otpSubject, mailContent)

    //save otp to admin
    admin.oneTimePassword = Number(opt)
    await admin.save()

    res.status(StatusCodes.OK).json({
      success: true,
      message: "OTP sent to email",
      verifyToken,
    })
  } catch (error) {
    let errorMessage = "Internal Server Error"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: errorMessage,
    })
  }
}

//verify otp
const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  const { otp, token } = req.body
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET as string
    ) as DecodedToken

    const admin = await Admin.findById(decoded.id)
    if (!admin) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Admin not found",
      })
      return
    }

    if (Number(otp) !== admin.oneTimePassword) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid OTP",
      })
      return
    }

    //token for password reset
    const resetToken = jwt.sign(
      { id: admin._id },
      process.env.JWT_ACCESS_TOKEN_SECRET as string,
      { expiresIn: "10m" }
    )

    //remove otp from admin
    admin.oneTimePassword = undefined
    await admin.save()

    res.status(StatusCodes.OK).json({
      success: true,
      message: "OTP verified successfully",
      resetToken,
    })
  } catch (error) {
    let errorMessage = "Internal Server Error"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: errorMessage,
    })
  }
}

//reset password
const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { password, token } = req.body
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET as string
    ) as DecodedToken

    const admin = await Admin.findById(decoded.id)
    if (!admin) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Unable to reset password",
      })
      return
    }

    admin.password = password

    admin.failedLoginAttempts = 0

    await admin.save()

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Password reset successfully",
    })
  } catch (error) {
    let errorMessage = "Internal Server Error"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: errorMessage,
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
  editAdmin,
  updatePassword,
  forgotPassword,
  verifyOtp,
  resetPassword,
}
