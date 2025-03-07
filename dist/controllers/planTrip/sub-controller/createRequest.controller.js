import PlanTrip from "../../../models/planTrip.model.js";
import UserDetails from "../../../models/userDetails.js";
import { sendSingleEmail } from "../../../utils/nodemailer.js";
import { StatusCodes } from "http-status-codes";
// Create Request
const createRequest = async (req, res) => {
    try {
        const { destination, isTrek, trek, isTour, tour, specialPlan, duration, travelType, adult, children, preferedAccomodation, mealType, estimatedBudget, fullName, email, phoneNumber, country, address, note, } = req.body;
        let fullMealType;
        if (mealType === "bb") {
            fullMealType = "Bread & Breakfast";
        }
        else if (mealType === "map") {
            fullMealType = "Half Board (Breakfast and Lunch / Dinner)";
        }
        else if (mealType === "ap") {
            fullMealType = "Full Board (Breakfast, Lunch and Dinner)";
        }
        else {
            fullMealType = "";
        }
        // Validate required fields
        if (!destination ||
            !duration ||
            !travelType ||
            !preferedAccomodation ||
            !mealType ||
            !estimatedBudget ||
            !fullName ||
            !email ||
            !phoneNumber ||
            !country ||
            !address) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ success: false, message: "All fields are required" });
        }
        // Create Request in DB
        const createRequest = await PlanTrip.create({
            destination,
            isTrek,
            trek,
            isTour,
            tour,
            specialPlan,
            duration,
            travelType,
            adult: parseInt(adult),
            children: parseInt(children),
            preferedAccomodation,
            mealType: fullMealType,
            estimatedBudget: parseInt(estimatedBudget),
            fullName,
            email,
            phoneNumber,
            country,
            address,
            note,
        });
        const checkUser = await UserDetails.find({ userEmail: email });
        if (checkUser.length === 0) {
            await UserDetails.create({
                userName: fullName,
                userEmail: email,
                userPhone: phoneNumber,
                userAddress: address,
                userCountry: country,
            });
        }
        if (!createRequest) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ success: false, message: "Failed to create request" });
        }
        // Prepare Email Content
        const subjectToUser = "Request Submitted";
        const subjectToAdmin = "New Plan Trip Request";
        const contentToUser = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; line-height: 1.6;">
      <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <p style="color: #333; font-size: 16px;">Hello ${fullName},</p>
        
        <p style="color: #2c3e50; font-weight: bold; margin-bottom: 20px;">Your request has been submitted successfully. Our team will contact you soon.</p>
        
        <h2 style="color: #34495e; border-bottom: 2px solid #3498db; padding-bottom: 10px; margin-top: 30px;">Request Details:</h2>
        <ul style="list-style-type: none; padding: 0; margin: 0;">
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Destination:</strong> ${destination}
          </li>
          ${isTrek
            ? `
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Trek Name:</strong> ${trek[0].trekName}
          </li>`
            : ""}
          ${isTour
            ? `
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Tour Name:</strong> ${tour[0].tourName}
          </li>`
            : ""}
          ${specialPlan
            ? `
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Special Plan:</strong> ${specialPlan}
          </li>`
            : ""}
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Duration:</strong> ${duration}
          </li>
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Travel Type:</strong> ${travelType}
          </li>
          ${adult
            ? `
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Adult:</strong> ${adult}
          </li>`
            : ""}
          ${children
            ? `
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Children:</strong> ${children}
          </li>`
            : ""}
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Preferred Accommodation:</strong> ${preferedAccomodation}
          </li>
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Meal Type:</strong> ${mealType}
          </li>
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Estimated Budget:</strong> ${estimatedBudget}
          </li>
        </ul>
        
        <h2 style="color: #34495e; border-bottom: 2px solid #3498db; padding-bottom: 10px; margin-top: 30px;">Personal Info:</h2>
        <ul style="list-style-type: none; padding: 0; margin: 0;">
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Name:</strong> ${fullName}
          </li>
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Email:</strong> ${email}
          </li>
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Phone:</strong> ${phoneNumber}
          </li>
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Country:</strong> ${country}
          </li>
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Address:</strong> ${address}
          </li>
          ${note
            ? `
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Note:</strong> ${note}
          </li>`
            : ""}
        </ul>
        
        <p style="color: #2c3e50; margin-top: 30px; text-align: center; font-weight: bold;">Thank you for choosing us!</p>
      </div>
    </div>
    `;
        const contentToAdmin = `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; line-height: 1.6;">
      <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h1 style="color: #2c3e50; text-align: center; border-bottom: 3px solid #3498db; padding-bottom: 15px; margin-bottom: 20px;">New Trip Plan Request</h1>
        
        <h2 style="color: #34495e; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Request Details:</h2>
        <ul style="list-style-type: none; padding: 0; margin: 0;">
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Destination:</strong> ${destination}
          </li>
          ${isTrek
            ? `
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Trek Name:</strong> ${trek[0].trekName}
          </li>`
            : ""}
          ${isTour
            ? `
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Tour Name:</strong> ${tour[0].tourName}
          </li>`
            : ""}
          ${specialPlan
            ? `
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Special Plan:</strong> ${specialPlan}
          </li>`
            : ""}
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Duration:</strong> ${duration}
          </li>
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Travel Type:</strong> ${travelType}
          </li>
          ${adult
            ? `
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Adult:</strong> ${adult}
          </li>`
            : ""}
          ${children
            ? `
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Children:</strong> ${children}
          </li>`
            : ""}
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Preferred Accommodation:</strong> ${preferedAccomodation}
          </li>
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Meal Type:</strong> ${mealType}
          </li>
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Estimated Budget:</strong> ${estimatedBudget}
          </li>
        </ul>
        
        <h2 style="color: #34495e; border-bottom: 2px solid #3498db; padding-bottom: 10px; margin-top: 30px;">Personal Info:</h2>
        <ul style="list-style-type: none; padding: 0; margin: 0;">
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Name:</strong> ${fullName}
          </li>
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Email:</strong> ${email}
          </li>
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Phone:</strong> ${phoneNumber}
          </li>
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Country:</strong> ${country}
          </li>
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Address:</strong> ${address}
          </li>
          ${note
            ? `
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Note:</strong> ${note}
          </li>`
            : ""}
        </ul>
      </div>
    </div>
    `;
        // Send Emails
        sendSingleEmail(email, subjectToUser, contentToUser);
        if (!process.env.AUTH_EMAIL) {
            throw new Error("AUTH_EMAIL environment variable is not defined");
        }
        sendSingleEmail(process.env.AUTH_EMAIL, subjectToAdmin, contentToAdmin);
        res
            .status(StatusCodes.CREATED)
            .json({ success: true, message: "Request created successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "An error occurred while processing your request.",
        });
    }
};
export default createRequest;
