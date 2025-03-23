import exp from "constants"
import mongoose from "mongoose"

const bookingPriceSchema = new mongoose.Schema(
  {
    adventureType: { type: String, required: true },
    trekId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trek",
      default: null,
    },
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      default: null,
    },
    wellnessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wellness",
      default: null,
    },
    activityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
      default: null,
    },
    pricePerPerson: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    soloFourStar: {
      type: Number,
      required: true,
    },
    soloFiveStar: {
      type: Number,
      required: true,
    },
    standardFourStar: {
      type: Number,
      required: true,
    },
    standardFiveStar: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const BookingPrice = mongoose.model("BookingPrice", bookingPriceSchema)
export { BookingPrice }
