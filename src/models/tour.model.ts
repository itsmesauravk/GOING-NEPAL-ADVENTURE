import mongoose from "mongoose"

// sub schemas

// Itinerary schema
const itinerarySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    details: { type: String, required: true },
    accommodations: { type: String },
    meals: { type: String },
    links: [
      {
        text: { type: String },
        url: { type: String },
      },
    ],
  },
  {
    _id: false,
  }
)

// FAQ sub-schema
const faqSchema = new mongoose.Schema(
  {
    question: { type: String },
    answer: { type: String },
  },
  {
    _id: false,
  }
)

//  highlights sub-schema
const highlightSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    links: [
      {
        text: { type: String },
        url: { type: String },
      },
    ],
  },
  {
    _id: false,
  }
)

// Main schema
const tourSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      default: "Tour",
    },
    name: { type: String, required: true },
    slug: { type: String, unique: true, default: "" },
    price: { type: Number, required: true },
    thumbnail: { type: String },
    country: {
      type: String,
      required: true,
    },
    language: { type: String, required: true },
    maxAltitude: { type: String, required: true },
    suitableAge: { type: String, required: true },
    days: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    location: { type: String, required: true },
    tripType: {
      type: String,
      required: true,
    },
    tripTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TripsAndTours",
      required: true,
    },
    groupSize: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    arrivalLocation: { type: String, required: true },
    departureLocation: { type: String, required: true },
    startingPoint: { type: String, required: true },
    endingPoint: { type: String, required: true },
    accommodation: { type: [String], required: true },
    thingsToKnow: { type: [String], required: true },
    meal: { type: String, enum: ["Inclusive", "Exclusive"], required: true },
    bestSeason: { type: [String], required: true },
    overview: { type: String, required: true },
    highlights: [highlightSchema],
    itinerary: [itinerarySchema], // Array of itinerary objects
    servicesCostIncludes: { type: [String], default: [] },
    servicesCostExcludes: { type: [String], default: [] },

    faq: [faqSchema], // Array of FAQ objects
    images: { type: [String], default: [] }, // Array of image URLs or paths
    video: { type: String },
    note: { type: String },

    // other fields
    viewsCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: true },
    isPopular: { type: Boolean, default: false },
    isRecommended: { type: Boolean, default: false },
    isNewItem: { type: Boolean, default: false },
    isActivated: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
)

const Tour = mongoose.model("Tour", tourSchema)

export default Tour
