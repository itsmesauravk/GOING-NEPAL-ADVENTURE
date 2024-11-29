import mongoose from "mongoose"
import { title } from "process"

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    blogImage: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      required: true,
    },

    blogViews: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    isNewBlog: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

const Blog = mongoose.model("Blog", blogSchema)

export default Blog
