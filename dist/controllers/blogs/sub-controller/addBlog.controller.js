import Blog from "../../../models/blog.model.js";
import { StatusCodes } from "http-status-codes";
import { uploadFile } from "../../../utils/cloudinary.js";
import slug from "slug";
const addBlog = async (req, res) => {
    try {
        const { title, description, links } = req.body;
        const image = req.file;
        if (!title || !description || !image) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ success: false, message: "All Fields Are Required" });
        }
        const uploadImage = await uploadFile(image.path, "blogs");
        if (!uploadImage) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ success: false, message: "Error Uploading Image" });
        }
        const blogSlug = slug(title);
        const newBlog = await Blog.create({
            title,
            slug: blogSlug,
            description,
            links: JSON.parse(links),
            blogImage: uploadImage.secure_url,
        });
        if (!newBlog) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ success: false, message: "Error Creating Blog" });
        }
        return res
            .status(StatusCodes.CREATED)
            .json({ success: true, message: "Blog Created Successfully" });
    }
    catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ success: false, message: error.message });
    }
};
export default addBlog;
