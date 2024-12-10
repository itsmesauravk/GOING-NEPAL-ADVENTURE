import { count, group } from "console"
import mongoose from "mongoose"

const faqsSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  { _id: false }
)

const activitySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      default: "Activity",
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
    price: {
      type: Number,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    groupSize: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
    },
    bestSeason: {
      type: [String],
      required: true,
    },

    thumbnail: {
      type: String,
    },

    overview: {
      type: String,
      required: true,
    },
    serviceIncludes: {
      type: [String],
      required: true,
    },
    thingsToKnow: {
      type: [String],
      required: true,
    },
    FAQs: [faqsSchema],
    gallery: {
      type: [String],
    },
    video: {
      type: String,
    },

    //other fields
    viewsCount: {
      type: Number,
      default: 0,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isActivated: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

const Activity = mongoose.model("Activity", activitySchema)

export default Activity
