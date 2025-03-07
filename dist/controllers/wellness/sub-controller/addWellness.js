import Wellness from "../../../models/wellness.model.js";
import { uploadFile, uploadVideo } from "../../../utils/cloudinary.js";
import { StatusCodes } from "http-status-codes";
import slug from "slug";
const addWellness = async (req, res) => {
    try {
        // console.log(req.body)
        const { name, price, country, clothesType, tourLanguage, maxAltitude, suitableAge, arrivalLocation, departureLocation, minDays, maxDays, location, groupSizeMin, groupSizeMax, startingPoint, endingPoint, accommodation, thingsToKnow, meal, bestSeason, overview, highlights, itinerary, servicesCostIncludes, servicesCostExcludes, faq, note, } = req.body;
        // const { thumbnail, images, video } = req.files
        const thumbnail = req.files?.thumbnail;
        const images = req.files?.images;
        const video = req.files?.video;
        // Validate required fields
        // console.log(req.body)
        if (!name ||
            !price ||
            !country ||
            !minDays ||
            !maxDays ||
            !location ||
            !clothesType ||
            !tourLanguage ||
            !maxAltitude ||
            !suitableAge ||
            !arrivalLocation ||
            !departureLocation ||
            !groupSizeMin ||
            !groupSizeMax ||
            !startingPoint ||
            !endingPoint ||
            !accommodation ||
            !thingsToKnow ||
            !meal ||
            !bestSeason ||
            !overview) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Please provide all required fields.",
            });
        }
        // Validate meal enum
        if (!["Inclusive", "Exclusive"].includes(meal)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid meal type",
            });
        }
        // Validate links in trek highlights
        if (highlights) {
            for (const highlight of highlights) {
                if (highlight.links) {
                    for (const link of highlight.links) {
                        if (!link.text || !link.url) {
                            return res.status(StatusCodes.BAD_REQUEST).json({
                                success: false,
                                message: "Invalid links in trek highlights",
                            });
                        }
                    }
                }
            }
        }
        // Upload thumbnail
        let uploadedThumbnail;
        if (thumbnail) {
            uploadedThumbnail = await uploadFile(thumbnail[0].path, "wellness/thumbnail");
            if (!uploadedThumbnail) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: "Error uploading thumbnail",
                });
            }
            uploadedThumbnail = uploadedThumbnail.secure_url;
        }
        // Upload images
        const uploadedImages = [];
        if (images && images.length > 0) {
            for (const image of images) {
                const uploadedImage = await uploadFile(image.path, "wellness/images");
                if (uploadedImage) {
                    uploadedImages.push(uploadedImage.secure_url);
                }
            }
        }
        // Upload video
        let uploadedVideo;
        if (video && video.length > 0) {
            const videoUpload = await uploadVideo(video[0].path, "wellness/videos");
            if (videoUpload) {
                uploadedVideo = videoUpload.secure_url;
            }
        }
        //slug
        const nameSlug = slug(name);
        // Create new trek
        const newTrek = new Wellness({
            name,
            slug: nameSlug,
            price,
            country,
            clothesType,
            language: tourLanguage,
            maxAltitude,
            suitableAge,
            arrivalLocation,
            departureLocation,
            days: { min: minDays, max: maxDays },
            location,
            groupSize: { min: groupSizeMin, max: groupSizeMax },
            startingPoint,
            endingPoint,
            accommodation: JSON.parse(accommodation),
            thingsToKnow: JSON.parse(thingsToKnow),
            meal,
            bestSeason: JSON.parse(bestSeason),
            overview,
            thumbnail: uploadedThumbnail,
            highlights: JSON.parse(highlights) || [],
            itinerary: JSON.parse(itinerary) || [],
            servicesCostIncludes: JSON.parse(servicesCostIncludes) || [],
            servicesCostExcludes: JSON.parse(servicesCostExcludes) || [],
            faq: JSON.parse(faq) || [],
            images: uploadedImages,
            video: uploadedVideo,
            note,
        });
        // Save tour to database
        const savedTour = await newTrek.save();
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Wellness added successfully",
            data: savedTour,
        });
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};
export default addWellness;
