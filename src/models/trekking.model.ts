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

// Packing list sub-schema
const packingListSchema = new mongoose.Schema(
  {
    general: { type: [String], default: [] },
    clothes: { type: [String], default: [] },
    firstAid: { type: [String], default: [] },
    otherEssentials: { type: [String], default: [] },
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

// trek highlights sub-schema
const trekHighlightSchema = new mongoose.Schema(
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

// Main trekking schema
const trekkingSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      default: "Trekking",
    },
    name: { type: String, required: true },
    slug: { type: String, unique: true, default: "" },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    thumbnail: { type: String },
    routeMapImage: { type: String },
    country: {
      type: String,
      required: true,
    },
    days: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    location: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Moderate", "Difficult"],
      required: true,
    },
    groupSize: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    startingPoint: { type: String, required: true },
    endingPoint: { type: String, required: true },
    accommodation: { type: [String], required: true },
    meal: { type: String, enum: ["Inclusive", "Exclusive"], required: true },
    bestSeason: { type: [String], required: true },
    overview: { type: String, required: true },
    trekHighlights: [trekHighlightSchema],
    itinerary: [itinerarySchema], // Array of itinerary objects
    servicesCostIncludes: { type: [String], default: [] },
    servicesCostExcludes: { type: [String], default: [] },
    packingList: packingListSchema, // Embedded packing list schema
    faq: [faqSchema], // Array of FAQ objects
    images: { type: [String], default: [] }, // Array of image URLs or paths
    video: { type: String },
    note: { type: String },
    trekPdf: { type: String },

    // other fields
    viewsCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: true },
    isPopular: { type: Boolean, default: false },

    isNewItem: { type: Boolean, default: false },
    isActivated: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
)

const Trekking = mongoose.model("Trekking", trekkingSchema)

export default Trekking
