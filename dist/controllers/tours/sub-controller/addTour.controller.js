import Tour from "../../../models/tour.model.js";
import { uploadFile, uploadVideo } from "../../../utils/cloudinary.js";
import { StatusCodes } from "http-status-codes";
import slug from "slug";
import TripsAndTours from "../../../models/tripsAndTours.model.js";
const addTour = async (req, res) => {
    try {
        // console.log(req.body)
        const { name, price, country, discount, tripType, tourLanguage, maxAltitude, suitableAge, arrivalLocation, departureLocation, minDays, maxDays, location, groupSizeMin, groupSizeMax, startingPoint, endingPoint, accommodation, thingsToKnow, meal, bestSeason, overview, highlights, itinerary, servicesCostIncludes, servicesCostExcludes, faq, note, } = req.body;
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
            !tripType ||
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
                message: "tESTING",
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
            uploadedThumbnail = await uploadFile(thumbnail[0].path, "tour/thumbnail");
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
                const uploadedImage = await uploadFile(image.path, "tour/images");
                if (uploadedImage) {
                    uploadedImages.push(uploadedImage.secure_url);
                }
            }
        }
        // Upload video
        let uploadedVideo;
        if (video && video.length > 0) {
            const videoUpload = await uploadVideo(video[0].path, "tour/videos");
            if (videoUpload) {
                uploadedVideo = videoUpload.secure_url;
            }
        }
        //slug
        const nameSlug = slug(name);
        // Create new trek
        const newTrek = new Tour({
            name,
            slug: nameSlug,
            price,
            discount,
            country,
            tripType: JSON.parse(tripType).title,
            tripTypeId: JSON.parse(tripType).id,
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
        //count the total trips document of the given id
        const totalTours = await Tour.countDocuments({
            tripTypeId: JSON.parse(tripType).id,
        });
        //update the total tours of the given id
        const updatedTripsAndTours = await TripsAndTours.findByIdAndUpdate(JSON.parse(tripType).id, { totalTours }, { new: true });
        if (!savedTour || !updatedTripsAndTours) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error saving trek",
            });
        }
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Tour added successfully",
            data: savedTour,
        });
    }
    catch (error) {
        console.error("Error in addTour:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};
export default addTour;
