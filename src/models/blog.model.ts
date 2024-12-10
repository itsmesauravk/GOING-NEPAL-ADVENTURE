import { link } from "fs"
import mongoose from "mongoose"
import { title } from "process"
import { text } from "stream/consumers"

const linksSchema = new mongoose.Schema(
  {
    text: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  {
    _id: false,
  }
)

const blogSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      default: "Blog",
    },
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
    links: [linksSchema],

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
