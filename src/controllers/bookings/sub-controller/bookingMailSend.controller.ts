import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { uploadFile } from "../../../utils/cloudinary.js"
import { sendSingleEmail } from "../../../utils/nodemailer.js"
import { Booking } from "../../../models/booking.model.js"

interface MulterRequest extends Request {
  files: {
    attachments?: Express.Multer.File[]
  }
}

const sendBookingMail = async (req: MulterRequest, res: Response) => {
  try {
    const { recipient, subject, message, name, link } = req.body
    const attachments = req.files?.attachments || []

    const reqId = req.params.id

    const updateRequest = await Booking.findById(reqId)

    if (!updateRequest) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Request not found" })
    }

    // Validate inputs
    if (!recipient || !subject || !message || !reqId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "All fields are required" })
    }

    const uploadedFiles: string[] = []

    // Use Promise.all for concurrent file uploads
    if (attachments.length > 0) {
      const uploadPromises = attachments.map(async (file) => {
        const upload = await uploadFile(file.path, "/bookings")
        return upload ? upload.secure_url : null
      })

      const uploadResults = await Promise.all(uploadPromises)
      uploadedFiles.push(
        ...uploadResults.filter((url): url is string => url !== null)
      )
    }

    // Send email to user
    const mailContent = `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 25px; border-radius: 10px;">
  <div style="background-color:rgb(74, 120, 221); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
    <img src="https://www.goingnepal.com/images/preference/hZ3sm-goinenepal.png" alt="Going Nepal Adventure" style="height: 60px; margin-bottom: 10px;">
    <h1 style="margin: 0; font-size: 24px; color: white; font-weight: 600;">Going Nepal Adventure</h1>
  </div>
  
  <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <h2 style="color: #1e3a8a; margin-bottom: 20px; font-size: 20px; font-weight: 500;">
      Payment Request: ${name ? name : recipient}
    </h2>
    
    <p style="color: #374151; line-height: 1.7; margin-bottom: 20px; font-size: 15px;">
      ${message}
    </p>

    ${
      link
        ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${link}" style="background-color: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block; transition: background-color 0.3s;">Make Payment</a>
    </div>
    `
        : ""
    }
    
    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 25px; border-left: 4px solid #2563eb;">
      <p style="color: #4b5563; line-height: 1.6; margin: 0; font-size: 14px;">
        <strong>Note:</strong> Please complete your payment to secure your booking. If you have any questions about this payment, please contact our support team at <a href="mailto:info@goingnepaladenture.com" style="color: #2563eb; text-decoration: none;">support@goingnepaladenture.com</a>.
      </p>
    </div>
    
    ${
      uploadedFiles.length > 0
        ? `
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin-top: 25px;">
          <h3 style="color: #1e3a8a; margin-bottom: 15px; font-size: 16px; font-weight: 500;">Payment Documents:</h3>
          ${uploadedFiles
            .map(
              (file) => `
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <span style="color: #2563eb; margin-right: 8px;">📄</span>
              <a href="${file}" style="color: #2563eb; text-decoration: none; overflow: hidden; text-overflow: ellipsis; font-size: 14px;">
                ${file.split("/").pop()}
              </a>
            </div>
          `
            )
            .join("")}
        </div>
        `
        : ""
    }
  </div>
  
  <div style="text-align: center; padding: 20px 0 0;">
    <p style="color: #6b7280; font-size: 13px; margin-bottom: 10px;">
      © ${new Date().getFullYear()} Going Nepal Adventure. All rights reserved.
    </p>
    <div style="margin-top: 15px;">
      <a href="https://www.facebook.com/going2nepal/" style="color: #2563eb; text-decoration: none; margin: 0 10px; font-size: 13px;">Facebook</a>
      <a href="https://www.instagram.com/goingnepal/" style="color: #2563eb; text-decoration: none; margin: 0 10px; font-size: 13px;">Instagram</a>
      <a href="https://www.goingnepaladventure.com/contact-us" style="color: #2563eb; text-decoration: none; margin: 0 10px; font-size: 13px;">Contact Us</a>
    </div>
  </div>
</div>
`
    await sendSingleEmail(recipient, subject, mailContent)

    // Update the booking status to "mailed"

    updateRequest.status = "mailed"
    await updateRequest.save()

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Email sent successfully",
      attachmentCount: uploadedFiles.length,
      updateRequest,
    })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    })
  }
}

export default sendBookingMail
