import mongoose, { CallbackWithoutResultAndOptionalError } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { AdminTypes, AdminDocument } from "../utils/types"

// Admin Schema
const adminSchema = new mongoose.Schema<AdminTypes>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    phoneNumber: {
      type: String,
      default: null,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: true,
      minlength: 8, // Password minimum length
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["Admin", "Moderator"],
      default: "Admin",
    },

    location: {
      type: String,
      default: null,
    },
    contactNumbers: {
      type: [String],
      default: [],
    },
    contactEmails: {
      type: [String],
      default: [],
    },
    facebookLink: {
      type: String,
      default: null,
    },
    twitterLink: {
      type: String,
      default: null,
    },
    instagramLink: {
      type: String,
      default: null,
    },
    linkedInLink: {
      type: String,
      default: null,
    },
    officeTimeStart: {
      type: String,
      default: null,
    },
    officeTimeEnd: {
      type: String,
      default: null,
    },
    otherWebsites: {
      type: [String],
      default: [],
    },

    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    lastLoginIP: {
      type: String,
      default: null,
    },
    // loginHistory: [
    //   {
    //     ip: String,
    //     timestamp: Date,
    //   },
    // ],
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lastFailedLoginAt: {
      type: Date,
      default: null,
    },
    securityQuestions: [
      {
        question: String,
        answer: String,
      },
    ],
    oneTimePassword: {
      type: Number,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

// Password hashing before saving
adminSchema.pre(
  "save",
  async function (this: any, next: CallbackWithoutResultAndOptionalError) {
    if (!this.isModified("password")) return next() // Only hash if password is new or modified
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  }
)

// // Generate JWT token
// adminSchema.methods.generateAccessToken = function (this: any): string {
//   const payload = {
//     id: this._id,
//     email: this.email,
//   }
//   return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET as string, {
//     expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN as string,
//   })
// }

// // Generate refresh token
// adminSchema.methods.generateRefreshToken = function (this: any): string {
//   const payload = { id: this._id }

//   return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET as string, {
//     expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as string,
//   })
// }

// Export Admin model
const Admin = mongoose.model("Admin", adminSchema)
export default Admin
