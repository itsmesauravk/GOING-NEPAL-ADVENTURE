import e from "express"
import mongoose from "mongoose"

const planTripSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      default: "PlanTrip",
    },
    //destination
    destination: {
      type: String,
      required: true,
      enum: ["Nepal", "Bhutan", "Tibet"],
    },
    // trek or tour (trek and tour if nepal) (only tour if bhutan and tibet)
    isTrek: {
      type: Boolean,
      required: true,
    },
    trek: [
      {
        trekId: {
          type: String,
        },
        trekName: {
          type: String,
        },
      },
    ],

    isTour: {
      type: Boolean,
      required: true,
    },
    tour: [
      {
        tourId: {
          type: String,
        },
        tourName: {
          type: String,
        },
      },
    ],

    specialPlan: {
      type: String,
    },

    //duration
    duration: {
      type: String,
      required: true,
    },

    // trvel and accomodation
    travelType: {
      type: String,
      required: true,
      enum: ["Solo", "Family/Group", "Couple"],
    },
    adult: {
      type: Number,
      default: 1,
    },
    children: {
      type: Number,
      default: 0,
    },
    preferedAccomodation: {
      type: String,
      required: true,
      enum: ["3 Star", "4 Star", "5 Star", "Luxury"],
    },
    mealType: {
      type: String,
      required: true,
    },

    // budget
    estimatedBudget: {
      type: Number,
      required: true,
    },

    //personal info
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    //additional info
    note: {
      type: String,
    },

    //status
    status: {
      type: String,
      required: true,
      enum: ["pending", "viewed", "mailed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
)

const PlanTrip = mongoose.model("PlanTrip", planTripSchema)

export default PlanTrip
