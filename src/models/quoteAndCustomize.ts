import mongoose from "mongoose"

const quoteAndCustomizeSchema = new mongoose.Schema(
  {
    requestType: {
      type: String,
      required: true,
      enum: ["quote", "customize"],
    },
    itemType: {
      type: String,
      required: true,
      enum: ["trekking", "tour", "wellness"],
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    itemSlug: {
      type: String,
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    //status
    status: {
      type: String,
      required: true,
      enum: ["pending", "viewed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
)

const QuoteAndCustomize = mongoose.model(
  "QuoteAndCustomize",
  quoteAndCustomizeSchema
)

export default QuoteAndCustomize
