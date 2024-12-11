import QuoteAndCustomize from "../../../models/quoteAndCustomize.js"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import UserDetails from "../../../models/userDetails.js"
import { sendSingleEmail } from "../../../utils/nodemailer.js"

const createRequest = async (req: Request, res: Response) => {
  try {
    const {
      requestType,
      name,
      email,
      number,
      message,
      itemSlug,
      itemName,
      itemType,
    } = req.body

    const request = new QuoteAndCustomize({
      requestType,
      name,
      email,
      number,
      message,
      itemSlug,
      itemName,
      itemType,
    })

    await request.save()

    if (!request) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Request not created",
      })
    }

    //update user details
    const user = await UserDetails.find({ userEmail: email })
    if (!user || user.length === 0) {
      const newUser = new UserDetails({
        userEmail: email,
        userName: name,
        userPhone: number,
      })
      await newUser.save()
    }
    // mail send

    const subjectAdmin = `New Request for ${requestType}`
    const subjectUser = `Request Submitted Successfully`
    const contentAdmin = `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; line-height: 1.6;">
      <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h1 style="color: #2c3e50; text-align: center; border-bottom: 3px solid #3498db; padding-bottom: 15px; margin-bottom: 20px;">New Request Submission</h1>
        
        <h2 style="color: #34495e; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Request Details:</h2>
        <ul style="list-style-type: none; padding: 0; margin: 0;">
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Request Type:</strong> ${requestType}
          </li>
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Name:</strong> ${name}
          </li>
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Email:</strong> ${email}
          </li>
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Phone Number:</strong> ${number}
          </li>
          ${
            message
              ? `
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Message:</strong> ${message}
          </li>`
              : ""
          }
        </ul>
      </div>
    </div>
`

    const contentUser = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; line-height: 1.6;">
      <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <p style="color: #333; font-size: 16px;">Hello ${name},</p>
        
        <p style="color: #2c3e50; font-weight: bold; margin-bottom: 20px;">Your request has been submitted successfully. Our team will contact you soon.</p>
        
        <h2 style="color: #34495e; border-bottom: 2px solid #3498db; padding-bottom: 10px; margin-top: 30px;">Request Details:</h2>
        <ul style="list-style-type: none; padding: 0; margin: 0;">
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Request Type:</strong> ${requestType}
          </li>
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Email:</strong> ${email}
          </li>
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Phone Number:</strong> ${number}
          </li>
          ${
            message
              ? `
          <li style="background-color: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px;">
            <strong style="color: #2980b9;">Your Message:</strong> ${message}
          </li>`
              : ""
          }
        </ul>
        
        <p style="color: #2c3e50; margin-top: 30px; text-align: center; font-weight: bold;">Thank you for reaching out!</p>
      </div>
    </div>
`

    //for admin

    if (!process.env.AUTH_EMAIL) {
      throw new Error("AUTH_EMAIL environment variable is not defined")
    }
    sendSingleEmail(process.env.AUTH_EMAIL, subjectAdmin, contentAdmin)

    //for user
    sendSingleEmail(email, subjectUser, contentUser)

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Request created successfully",
      data: request,
    })
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    })
  }
}

export default createRequest
