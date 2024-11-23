const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// Admin Schema
const adminSchema = new mongoose.Schema({
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
    enum: ["SuperAdmin", "Admin", "Moderator"],
    default: "Admin",
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
  loginHistory: [
    {
      ip: String,
      timestamp: Date,
    },
  ],
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
})

// Model creation
const Admin = mongoose.model("Admin", adminSchema)

module.exports = Admin
