import mongoose from "mongoose";
const bookingPriceSchema = new mongoose.Schema({
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
    singleSupplementary: {
        type: Number,
        default: 0,
    },
    singleSupplementaryThreeStar: {
        type: Number,
        default: 0,
    },
    singleSupplementaryFourStar: {
        type: Number,
        default: 0,
    },
    singleSupplementaryFiveStar: {
        type: Number,
        default: 0,
    },
    solo: {
        type: Number,
        default: 0,
    },
    soloThreeStar: {
        type: Number,
        default: 0,
    },
    soloFourStar: {
        type: Number,
        default: 0,
    },
    soloFiveStar: {
        type: Number,
        default: 0,
    },
    standardThreeStar: {
        type: Number,
        default: 0,
    },
    standardFourStar: {
        type: Number,
        default: 0,
    },
    standardFiveStar: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
const BookingPrice = mongoose.model("BookingPrice", bookingPriceSchema);
export { BookingPrice };
