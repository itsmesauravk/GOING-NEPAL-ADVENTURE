export interface QueryObjectType {
  name?: string
  country?: string
  updatedAt?: string
  status?: string
  difficulty?: string
  sort?: string
  visibility?: "isFeatured" | "isPopular" | "isNewItem" | "isRecommended"
  [key: string]: string | undefined | { $ne: string } | object
  _id?: { $ne: string }
  // name?: { $regex: string; $options: string };
}

export interface BlogQueryObjectType {
  title?: string
  createdAt?: string
  sort?: string
  search?: string
  visibility?: "isNewBlog" | "isActive"
  [key: string]: string | undefined
}

export interface ActivityQueryObjectType {
  title?: string
  country?: string
  updatedAt?: string
  difficulty?: string
  sort?: string
  visibility?: "isPopular" | "isActivated"
  [key: string]: string | undefined | { $ne: string } | object
  _id?: { $ne: string }
}

export interface RequestQueryObjectType {
  requestType?: string
  itemType?: string
  status?: string
  search?: string
  sort?: string
}

import { Document } from "mongoose"
import { off } from "process"

export interface AdminTypes {
  fullName: string
  email: string
  phoneNumber?: string | null
  profilePicture?: string | null
  password: string
  isActive: boolean
  isSuspended: boolean
  role: "Admin" | "Moderator"
  location?: string | null
  contactNumbers: string[]
  contactEmails: string[]
  facebookLink?: string | null
  twitterLink?: string | null
  instagramLink?: string | null
  linkedInLink?: string | null
  otherWebsites?: string[] | null
  officeTimeStart?: string | null
  officeTimeEnd?: string | null
  twoFactorEnabled: boolean
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date | null
  lastLoginIP?: string | null
  loginHistory: {
    ip: string
    timestamp: Date
  }[]
  failedLoginAttempts: number
  lastFailedLoginAt?: Date | null
  securityQuestions: {
    question: string
    answer: string
  }[]
  oneTimePassword?: number | null
  refreshToken?: string | null
}
// Extend Mongoose's Document with the Admin interface
export interface AdminDocument extends Document, AdminTypes {}
