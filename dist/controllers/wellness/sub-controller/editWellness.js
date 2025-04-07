import Wellness from "../../../models/wellness.model.js";
import { uploadFile, uploadVideo, deleteImage, } from "../../../utils/cloudinary.js";
import { StatusCodes } from "http-status-codes";
import slug from "slug";
const editWellness = async (req, res) => {
    try {
        const { wellnessId, imagesToDelete, thumbnailToDelete, videoToDelete, ...updateData } = req.body;
        const files = req.files || {};
        // Find existing wellness
        const existingWellness = await Wellness.findById(wellnessId);
        if (!existingWellness) {
            res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Wellness program not found",
            });
            return;
        }
        // Handle file deletions first
        const updateFields = { ...updateData };
        // Parse imagesToDelete from JSON string
        const imagesToDeleteArray = imagesToDelete ? JSON.parse(imagesToDelete) : [];
        // Delete specified images
        if (imagesToDeleteArray.length > 0) {
            const remainingImages = existingWellness.images.filter((img) => !imagesToDeleteArray.includes(img));
            // Delete images from Cloudinary
            await Promise.all(imagesToDeleteArray.map(async (imageUrl) => {
                try {
                    await deleteImage(imageUrl);
                }
                catch (error) {
                    console.error(`Failed to delete image: ${imageUrl}`, error);
                }
            }));
            updateFields.images = remainingImages;
        }
        // Handle thumbnail deletion/update
        if (thumbnailToDelete === "true" && existingWellness.thumbnail) {
            await deleteImage(existingWellness.thumbnail);
            updateFields.thumbnail = null;
        }
        if (files.thumbnail) {
            if (existingWellness.thumbnail) {
                await deleteImage(existingWellness.thumbnail);
            }
            const uploadedThumbnail = await uploadFile(files.thumbnail[0].path, "wellness/thumbnail");
            updateFields.thumbnail = uploadedThumbnail?.secure_url;
        }
        // Handle video deletion/update
        if (videoToDelete === "true" && existingWellness.video) {
            await deleteImage(existingWellness.video);
            updateFields.video = null;
        }
        if (files.video) {
            if (existingWellness.video) {
                await deleteImage(existingWellness.video);
            }
            const uploadedVideo = await uploadVideo(files.video[0].path, "wellness/videos");
            updateFields.video = uploadedVideo?.secure_url;
        }
        // Handle new images upload
        if (files.images && files.images.length > 0) {
            const newImages = await Promise.all(files.images.map((image) => uploadFile(image.path, "wellness/images")));
            const validNewImages = newImages
                .filter((img) => img !== null)
                .map((img) => img.secure_url);
            updateFields.images = [
                ...(updateFields.images || existingWellness.images),
                ...validNewImages,
            ];
        }
        // Update slug if name changes
        if (updateData.name) {
            updateFields.slug = slug(updateData.name);
        }
        // Handle days object structure
        if (updateData.minDays || updateData.maxDays) {
            updateFields.days = {
                min: updateData.minDays || (existingWellness.days?.min ?? 0),
                max: updateData.maxDays || (existingWellness.days?.max ?? 0),
            };
        }
        // Handle groupSize object structure
        if (updateData.groupSizeMin || updateData.groupSizeMax) {
            updateFields.groupSize = {
                min: (updateData.groupSizeMin || existingWellness.groupSize?.min) ?? 0,
                max: (updateData.groupSizeMax || existingWellness.groupSize?.max) ?? 0,
            };
        }
        const normalFields = [
            "name",
            "price",
            "country",
            "location",
            "language",
            "suitableAge",
            "maxAltitude",
            "startingPoint",
            "endingPoint",
            "arrivalLocation",
            "departureLocation",
            "clothesType",
            "meal",
            "overview",
            "note",
        ];
        normalFields.forEach((field) => {
            if (updateData[field]) {
                updateFields[field] = updateData[field];
            }
        });
        // Parse JSON fields
        const jsonFields = [
            "accommodation",
            "thingsToKnow",
            "bestSeason",
            "highlights",
            "itinerary",
            "servicesCostIncludes",
            "servicesCostExcludes",
            "faq",
        ];
        jsonFields.forEach((field) => {
            if (updateData[field]) {
                try {
                    updateFields[field] = JSON.parse(updateData[field]);
                }
                catch (error) {
                    console.error(`Error parsing ${field}:`, error);
                }
            }
        });
        // Update wellness program with all changes
        const updatedWellness = await Wellness.findByIdAndUpdate(wellnessId, { $set: updateFields }, { new: true, runValidators: true });
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Wellness program updated successfully",
            data: updatedWellness,
        });
    }
    catch (error) {
        console.error("Error in editWellness:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to update wellness program",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};
export default editWellness;
