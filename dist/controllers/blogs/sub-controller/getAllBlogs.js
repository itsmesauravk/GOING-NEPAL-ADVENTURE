import Blog from "../../../models/blog.model.js";
import { StatusCodes } from "http-status-codes";
const getAllBlogs = async (req, res) => {
    try {
        const { sort, search, visibility } = req.query;
        const queryObject = {};
        if (search) {
            queryObject.title = { $regex: search, $options: "i" };
        }
        if (visibility === "all") {
            // No additional filter admin want to see all treks
        }
        else if (visibility === "isActive" || visibility === "isNewBlog") {
            queryObject[visibility] = "true";
        }
        else if (visibility === "notActive") {
            queryObject.isActive = "false";
        }
        else if (visibility === "notNewBlog") {
            queryObject.isNewBlog = "false";
        }
        else {
            // default: only show activated treks
            queryObject.isActive = "true";
        }
        let blog = Blog.find(queryObject);
        // sorting = -price,createdAt
        let sorting = "";
        if (sort && typeof sort === "string") {
            sorting = sort.split(",").join(" ");
            if (sorting) {
                blog = blog.sort(sorting);
            }
        }
        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 100;
        let skip = (page - 1) * limit;
        const blogs = await blog.skip(skip).limit(limit);
        if (!blogs || blogs.length === 0) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ success: false, message: "No Blogs Found" });
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Blogs Fetched Successfully",
            data: blogs,
        });
    }
    catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ success: false, message: error.message });
    }
};
export default getAllBlogs;
