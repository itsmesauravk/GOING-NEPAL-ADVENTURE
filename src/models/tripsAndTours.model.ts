import mongoose from "mongoose"

const tripsAndToursSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    //other details
    totalTours: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

const TripsAndTours = mongoose.model("TripsAndTours", tripsAndToursSchema)

export default TripsAndTours
