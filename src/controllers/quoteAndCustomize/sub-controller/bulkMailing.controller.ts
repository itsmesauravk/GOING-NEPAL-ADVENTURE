import QuoteAndCustomize from "../../../models/quoteAndCustomize.js"
import { Request, Response } from "express"
import { sendBulkEmail } from "../../../utils/nodemailer.js"
import { uploadFile } from "../../../utils/cloudinary.js"

interface MulterRequest extends Request {
  files: {
    attachments?: Express.Multer.File[]
  }
}

const bulkMailing = async (req: MulterRequest, res: Response) => {
  try {
    const { emails, subject, message } = req.body
    const attachments = req.files?.attachments || []

    if (!subject || !emails || !message) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required. Please provide emails, subject, and message.",
      })
    }

    const uploadedFiles: string[] = await Promise.all(
      attachments.map(async (file) => {
        try {
          const upload = await uploadFile(file.path, "/quoteAndCustomize")
          return upload?.secure_url || ""
        } catch {
          return ""
        }
      })
    ).then((urls) => urls.filter((url) => url))

    const mailContentTemplate = (
      emailMessage: string,
      uploadedFiles: string[]
    ) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f6; padding: 20px; border-radius: 8px;">
        <div style="background-color: #3B82F6; color: white; padding: 15px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Going Nepal Adventure</h1>
        </div>
        <div style="background-color: white; padding: 25px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #1E40AF; margin-bottom: 15px; font-size: 20px;">Hello,</h2>
          <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">${emailMessage}</p>
          ${
            uploadedFiles.length > 0
              ? `
            <div style="background-color: #F3F4F6; border-top: 1px solid #E5E7EB; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <h3 style="color: #1E40AF; margin-bottom: 10px; font-size: 16px;">Attached Files:</h3>
              ${uploadedFiles
                .map(
                  (file) =>
                    `<a href="${file}" style="color: #3B82F6; text-decoration: none; display: block; margin-bottom: 5px; overflow: hidden; text-overflow: ellipsis;">📄 ${file
                      .split("/")
                      .pop()}</a>`
                )
                .join("")}
            </div>`
              : ""
          }
        </div>
        <div style="text-align: center; color: #6B7280; padding: 10px; font-size: 12px;">© ${new Date().getFullYear()} Going Nepal Adventure</div>
      </div>`

    const emailSendResults = await Promise.allSettled(
      emails.map((singleEmail: any) => {
        const mailContent = mailContentTemplate(message, uploadedFiles)
        return sendBulkEmail(singleEmail, subject, mailContent)
      })
    )

    const failedEmails = emailSendResults
      .filter((result) => result.status === "rejected")
      .map((_, index) => emails[index])

    if (failedEmails.length > 0) {
      return res.status(207).json({
        success: false,
        message: "Some emails failed to send.",
        failedEmails,
      })
    }

    res.status(200).json({
      success: true,
      message: "All emails sent successfully.",
    })
  } catch (error: any) {
    console.error("Error sending bulk emails:", error)
    res.status(500).json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
    })
  }
}

export default bulkMailing
