import Activity from "../../../models/activities.model.js";
import { StatusCodes } from "http-status-codes";
import slug from "slug";
import { deleteImage, uploadFile, uploadVideo, } from "../../../utils/cloudinary.js";
const editActivity = async (req, res) => {
    try {
        const { id, title, price, country, location, groupSizeMin, groupSizeMax, bestSeason, overview, serviceIncludes, thingsToKnow, imageToDelete, FAQs, } = req.body;
        // Find existing activity
        const activity = await Activity.findById(id);
        if (!activity) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Activity not found",
            });
        }
        // Prepare update object
        const updateData = {};
        //handle images delete
        if (imageToDelete && imageToDelete?.length > 0) {
            const deleteItems = JSON.parse(imageToDelete);
            if (deleteItems.length > 0) {
                const remainingImages = activity.gallery.filter((img) => !deleteItems.includes(img));
                // Delete images from Cloudinary
                await Promise.all(deleteItems.map(async (imageUrl) => {
                    try {
                        await deleteImage(imageUrl);
                    }
                    catch (error) {
                        console.error(`Failed to delete image: ${imageUrl}`, error);
                    }
                }));
                updateData.gallery = remainingImages;
            }
        }
        // Update basic fields if provided
        if (title) {
            updateData.title = title;
            updateData.slug = slug(title, { lower: true });
        }
        if (price)
            updateData.price = price;
        if (country)
            updateData.country = country;
        if (location)
            updateData.location = location;
        if (groupSizeMin || groupSizeMax) {
            updateData.groupSize = {
                min: (groupSizeMin || activity.groupSize?.min) ?? 0,
                max: (groupSizeMax || activity.groupSize?.max) ?? 0,
            };
        }
        if (bestSeason)
            updateData.bestSeason = JSON.parse(bestSeason);
        if (overview)
            updateData.overview = overview;
        if (serviceIncludes)
            updateData.serviceIncludes = JSON.parse(serviceIncludes);
        if (thingsToKnow)
            updateData.thingsToKnow = JSON.parse(thingsToKnow);
        if (FAQs)
            updateData.FAQs = JSON.parse(FAQs);
        // Handle file uploads if present
        const { thumbnail, image, video } = req.files || {};
        // Update thumbnail if new one is provided
        if (thumbnail) {
            const thumbnailUrl = await uploadFile(thumbnail[0].path, "/activities/thumbnail");
            if (thumbnailUrl) {
                updateData.thumbnail = thumbnailUrl.secure_url;
            }
        }
        // Update gallery images if new ones are provided
        if (image) {
            const newGalleryUrls = await Promise.all(image.map(async (img) => (await uploadFile(img.path, "/activities/image"))?.secure_url));
            // Combine with existing images or replace based on your requirements
            updateData.gallery = [...(activity.gallery || []), ...newGalleryUrls];
        }
        // Update video if new one is provided
        if (video) {
            const videoUrl = await uploadVideo(video[0].path, "/activities/video");
            if (videoUrl) {
                updateData.video = videoUrl;
            }
        }
        // Update the activity
        const updatedActivity = await Activity.findByIdAndUpdate(id, { $set: updateData }, { new: true });
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Activity updated successfully",
            data: updatedActivity,
        });
    }
    catch (error) {
        console.error("Error updating activity:", error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
export default editActivity;
