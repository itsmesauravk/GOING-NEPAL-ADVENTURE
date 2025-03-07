import UserDetails from "../../models/userDetails.js";
import { StatusCodes } from "http-status-codes";
// Get all user details
const getUserDetails = async (req, res) => {
    try {
        const { search, sort } = req.query;
        let queryObject = {};
        if (search) {
            queryObject = { userName: { $regex: search, $options: "i" } };
        }
        let users = UserDetails.find(queryObject);
        if (sort && typeof sort === "string") {
            users = users.sort(sort);
        }
        let limit = Number(req.query.limit) || 20;
        let page = Number(req.query.page) || 1;
        let skip = (page - 1) * limit;
        users = users.skip(skip).limit(limit);
        const userDetails = await users;
        if (userDetails.length === 0) {
            res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "No User Details Found",
            });
            return;
        }
        res.status(StatusCodes.OK).json({
            success: true,
            data: userDetails,
        });
    }
    catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};
// add new client
const addNewClientDetails = async (req, res) => {
    try {
        const userDetails = new UserDetails(req.body);
        const newUserDetails = await userDetails.save();
        if (!newUserDetails) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Unable to add Client Details, Please try again",
            });
            return;
        }
        res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Client Details Added",
        });
    }
    catch (error) {
        let errorMessage = "Internal Server Error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: errorMessage,
        });
    }
};
// delete user info
const deleteUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Data is Invalid",
                error: "Invalid data",
            });
            return;
        }
        const userDetails = await UserDetails.findByIdAndDelete(id);
        if (!userDetails) {
            res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Client Details not found",
                error: `Client Details not found with id: ${id}`,
            });
            return;
        }
        res
            .status(StatusCodes.OK)
            .json({ success: true, message: "Client Details deleted" });
    }
    catch (error) {
        let errorMessage = "Internal Server Error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
            error: errorMessage,
        });
    }
};
export { getUserDetails, addNewClientDetails, deleteUserDetails };
