import { Booking } from "../../../models/booking.model.js"
import { StatusCodes } from "http-status-codes"
import { Request, Response } from "express"
import UserDetails from "../../../models/userDetails.js"
import { sendSingleEmail } from "../../../utils/nodemailer.js"

const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      fullName,
      email,
      phone,
      address,
      adventureType,
      adventureName,
      adventureSlug,
      adventureId,
      bookingDate,
      extraServices,
      soloStandard,
      totalPrice,
    } = req.body

    if (
      !fullName ||
      !email ||
      !phone ||
      !address ||
      !adventureType ||
      !adventureName ||
      !adventureSlug ||
      !adventureId ||
      !bookingDate ||
      !totalPrice
    ) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Please provide all required fields" })
      return
    }

    //update user details
    const user = await UserDetails.find({ userEmail: email })
    if (!user || user.length === 0) {
      const newUser = new UserDetails({
        userEmail: email,
        userName: fullName,
        userPhone: phone,
        userAddress: address,
      })
      await newUser.save()
    }

    // Assign the correct ID based on adventureType
    const booking = new Booking({
      fullName,
      email,
      phone,
      address,
      adventureType,
      adventureName,
      adventureSlug,
      trekId: adventureType === "Trekking" ? adventureId : null,
      tourId: adventureType === "Tour" ? adventureId : null,
      wellnessId: adventureType === "Wellness" ? adventureId : null,
      activityId: adventureType === "Activity" ? adventureId : null,
      bookingDate,
      extraServices,
      soloStandard,
      totalPrice,
    })

    const create = await booking.save()

    if (!create) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Booking failed" })
      return
    }

    //send mail

    const subjectAdmin = `New ${adventureType} Booking Request Received`
    const subjectUser = `Your Booking Request Has Been Submitted Successfully`

    const contentAdmin = `
  <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; line-height: 1.6;">
    <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
      <h1 style="color: #2c3e50; text-align: center; border-bottom: 2px solid #3498db; padding-bottom: 15px; margin-bottom: 25px; font-size: 24px;">New Booking Request</h1>
      
      <div style="background-color: #ebf7ff; border-left: 4px solid #3498db; padding: 12px 15px; margin-bottom: 25px; border-radius: 0 4px 4px 0;">
        <p style="margin: 0; color: #2c3e50;">A new booking request has been submitted that requires your review.</p>
      </div>
      
      <h2 style="color: #34495e; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px; font-size: 18px;">Booking Details</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; width: 35%; color: #2980b9; font-weight: bold;">Booking ID:</td>
          <td style="padding: 12px; border-bottom: 1px solid #f0f0f0;">${
            create._id
          }</td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; width: 35%; color: #2980b9; font-weight: bold;">Tourist Name:</td>
          <td style="padding: 12px; border-bottom: 1px solid #f0f0f0;">${fullName}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; width: 35%; color: #2980b9; font-weight: bold;">Tourist Email:</td>
          <td style="padding: 12px; border-bottom: 1px solid #f0f0f0;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; width: 35%; color: #2980b9; font-weight: bold;">Phone Number:</td>
          <td style="padding: 12px; border-bottom: 1px solid #f0f0f0;">${phone}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; width: 35%; color: #2980b9; font-weight: bold;">Adventure Type:</td>
          <td style="padding: 12px; border-bottom: 1px solid #f0f0f0;">${adventureType}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; width: 35%; color: #2980b9; font-weight: bold;">Adventure Name:</td>
           <td style="padding: 12px; border-bottom: 1px solid #f0f0f0;">
            ${adventureName}
            <a href="${
              process.env.CLIENT_URL_PROD
            }/${adventureType.toLowerCase()}/${adventureSlug}" style="margin-left: 10px; color: #3498db; text-decoration: none;">View Details</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; width: 35%; color: #2980b9; font-weight: bold;">Tour Date:</td>
          <td style="padding: 12px; border-bottom: 1px solid #f0f0f0;">${bookingDate}</td>
        </tr>
        ${
          extraServices
            ? `<tr>
          <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; width: 35%; color: #2980b9; font-weight: bold;">Extra Services:</td>
          <td style="padding: 12px; border-bottom: 1px solid #f0f0f0;">${extraServices}</td>
        </tr>`
            : ""
        }
        ${
          soloStandard
            ? `<tr>
          <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; width: 35%; color: #2980b9; font-weight: bold;">Solo Standard:</td>
          <td style="padding: 12px; border-bottom: 1px solid #f0f0f0;">${soloStandard}</td>
        </tr>`
            : ""
        }
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; width: 35%; color: #2980b9; font-weight: bold;">Total Price:</td>
          <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; font-weight: bold;">$${totalPrice}</td>
        </tr>
      </table>
      
      <div style="text-align: center; margin-top: 25px;">
        <a href="${process.env.CLIENT_URL}/bookings/${
      create._id
    }" style="background-color: #3498db; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Review Booking</a>
      </div>
    </div>
    <div style="text-align: center; padding: 15px; color: #7f8c8d; font-size: 12px;">
      <p>This is an automated notification. Please do not reply to this email.</p>
    </div>
  </div>
`

    const contentUser = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; line-height: 1.6;">
    <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
      <h1 style="color: #2c3e50; text-align: center; border-bottom: 2px solid #3498db; padding-bottom: 15px; margin-bottom: 25px; font-size: 22px;">Booking Confirmation</h1>
      
      <p style="color: #333; font-size: 16px;">Dear ${fullName},</p>
      
    
      
      <h2 style="color: #34495e; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px; font-size: 18px;">Your Booking Details</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; width: 40%; color: #2980b9; font-weight: bold;">Adventure Name:</td>
          <td style="padding: 12px; border-bottom: 1px solid #f0f0f0;">
            ${adventureName}
            <a href="${
              process.env.CLIENT_URL_PROD
            }/${adventureType.toLowerCase()}/${adventureSlug}" style="margin-left: 10px; color: #3498db; text-decoration: none;">View Details</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; width: 40%; color: #2980b9; font-weight: bold;">Adventure Type:</td>
          <td style="padding: 12px; border-bottom: 1px solid #f0f0f0;">${adventureType}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; width: 40%; color: #2980b9; font-weight: bold;">Tour Date:</td>
          <td style="padding: 12px; border-bottom: 1px solid #f0f0f0;">${bookingDate}</td>
        </tr>
        ${
          extraServices
            ? `<tr>
          <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; width: 40%; color: #2980b9; font-weight: bold;">Extra Services:</td>
          <td style="padding: 12px; border-bottom: 1px solid #f0f0f0;">${extraServices}</td>
        </tr>`
            : ""
        }
        ${
          soloStandard
            ? `<tr>
          <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; width: 40%; color: #2980b9; font-weight: bold;">Solo Standard:</td>
          <td style="padding: 12px; border-bottom: 1px solid #f0f0f0;">${soloStandard}</td>
        </tr>`
            : ""
        }
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; width: 40%; color: #2980b9; font-weight: bold;">Total Price:</td>
          <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; font-weight: bold;">$${totalPrice}</td>
        </tr>
      </table>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin-top: 25px;">
        <h3 style="color: #34495e; margin-top: 0; font-size: 16px;">What happens next?</h3>
        <ol style="color: #555; padding-left: 20px; margin-bottom: 0;">
          <li>Your request will be reviewed from our team</li>
          <li>You'll receive a confirmation email after review</li>
          <li>Payment instructions will be provided upon confirmation</li>
        </ol>
      </div>
      
      <p style="color: #2c3e50; margin-top: 25px; text-align: center;">Thank you for choosing our adventure services!</p>
      
      
    </div>
    <div style="text-align: center; padding: 15px; color: #7f8c8d; font-size: 12px;">
      <p>If you have any questions, please contact our support team.</p>
    </div>
  </div>
`

    //for admin

    if (!process.env.AUTH_EMAIL) {
      throw new Error("AUTH_EMAIL environment variable is not defined")
    }
    await sendSingleEmail(process.env.AUTH_EMAIL, subjectAdmin, contentAdmin)

    //for user
    await sendSingleEmail(email, subjectUser, contentUser)

    res
      .status(StatusCodes.CREATED)
      .json({ success: true, message: "Booking successful", data: create })
  } catch (error) {
    console.log("Booking error: ", error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export { createBooking }
