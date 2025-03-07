import Trekking from "../../../models/trekking.model.js";
import { uploadFile, uploadVideo, deleteImage, } from "../../../utils/cloudinary.js";
import { StatusCodes } from "http-status-codes";
import slug from "slug";
const editTrek = async (req, res) => {
    try {
        const { trekId, imagesToDelete = [], thumbnailToDelete, videoToDelete, ...updateData } = req.body;
        const files = req.files || {};
        // Find existing trek
        const existingTrek = await Trekking.findById(trekId);
        if (!existingTrek) {
            res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Trek not found",
            });
            return;
        }
        // Handle file deletions first
        const updateFields = { ...updateData };
        // Delete specified images
        if (imagesToDelete.length > 0) {
            const remainingImages = existingTrek.images.filter((img) => !imagesToDelete.includes(img));
            // Delete images from Cloudinary
            await Promise.all(imagesToDelete.map(async (imageUrl) => {
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
        if (thumbnailToDelete && existingTrek.thumbnail) {
            await deleteImage(existingTrek.thumbnail);
            updateFields.thumbnail = null;
        }
        if (files.thumbnail) {
            if (existingTrek.thumbnail) {
                await deleteImage(existingTrek.thumbnail);
            }
            const uploadedThumbnail = await uploadFile(files.thumbnail[0].path, "trekking/thumbnail");
            updateFields.thumbnail = uploadedThumbnail?.secure_url;
        }
        // Handle video deletion/update
        if (videoToDelete && existingTrek.video) {
            await deleteImage(existingTrek.video);
            updateFields.video = null;
        }
        if (files.video) {
            if (existingTrek.video) {
                await deleteImage(existingTrek.video);
            }
            const uploadedVideo = await uploadVideo(files.video[0].path, "trekking/videos");
            updateFields.video = uploadedVideo?.secure_url;
        }
        // Handle new images upload
        if ((files.images || []).length > 0) {
            const newImages = await Promise.all((files.images || []).map((image) => uploadFile(image.path, "trekking/images")));
            const validNewImages = newImages
                .filter((img) => img !== null)
                .map((img) => img.secure_url);
            updateFields.images = [
                ...(updateFields.images || existingTrek.images),
                ...validNewImages,
            ];
        }
        // Parse JSON fields if they exist
        if (updateData.name) {
            updateFields.slug = slug(updateData.name);
        }
        if (updateData.accommodation) {
            updateFields.accommodation = JSON.parse(updateData.accommodation);
        }
        if (updateData.bestSeason) {
            updateFields.bestSeason = JSON.parse(updateData.bestSeason);
        }
        if (updateData.trekHighlights) {
            updateFields.trekHighlights = JSON.parse(updateData.trekHighlights);
        }
        if (updateData.itinerary) {
            updateFields.itinerary = JSON.parse(updateData.itinerary);
        }
        if (updateData.servicesCostIncludes) {
            updateFields.servicesCostIncludes = JSON.parse(updateData.servicesCostIncludes);
        }
        if (updateData.servicesCostExcludes) {
            updateFields.servicesCostExcludes = JSON.parse(updateData.servicesCostExcludes);
        }
        if (updateData.packingList) {
            updateFields.packingList = JSON.parse(updateData.packingList);
        }
        if (updateData.faq) {
            updateFields.faq = JSON.parse(updateData.faq);
        }
        // Update trek with all changes
        const updatedTrek = await Trekking.findByIdAndUpdate(trekId, { $set: updateFields }, { new: true, runValidators: true });
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Trek updated successfully",
            data: updatedTrek,
        });
    }
    catch (error) {
        let errorMessage = "Internal server error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
            error: errorMessage,
        });
    }
};
export default editTrek;
