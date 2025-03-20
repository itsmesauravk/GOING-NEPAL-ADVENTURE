import mongoose from "mongoose";
const BookingSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    adventureType: {
        type: String,
        required: true,
    },
    adventureName: {
        type: String,
        required: true,
    },
    adventureSlug: {
        type: String,
        required: true,
    },
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
    bookingDate: {
        type: Date,
        required: true,
    },
    extraServices: {
        type: String,
        default: null,
    },
    soloStandard: {
        type: String,
        default: null,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "viewed", "confirmed", "cancelled", "rejected"],
        default: "pending",
    },
}, {
    timestamps: true,
});
const Booking = mongoose.model("Booking", BookingSchema);
export { Booking };
