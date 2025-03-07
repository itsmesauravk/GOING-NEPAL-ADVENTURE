import PlanTrip from "../../../models/planTrip.model.js";
import { StatusCodes } from "http-status-codes";
import { uploadFile } from "../../../utils/cloudinary.js";
import { sendSingleEmail } from "../../../utils/nodemailer.js";
const sendMail = async (req, res) => {
    try {
        const { recipient, subject, message, name } = req.body;
        const attachments = req.files?.attachments || [];
        // Validate inputs
        if (!recipient || !subject || !message) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ success: false, message: "All fields are required" });
        }
        const uploadedFiles = [];
        // Use Promise.all for concurrent file uploads
        if (attachments.length > 0) {
            const uploadPromises = attachments.map(async (file) => {
                const upload = await uploadFile(file.path, "/planTrip");
                return upload ? upload.secure_url : null;
            });
            const uploadResults = await Promise.all(uploadPromises);
            uploadedFiles.push(...uploadResults.filter((url) => url !== null));
        }
        // Send email to user
        const mailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f6; padding: 20px; border-radius: 8px;">
  <div style="background-color: #3B82F6; color: white; padding: 15px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">Going Nepal Adventure</h1>
  </div>
  
  <div style="background-color: white; padding: 25px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <h2 style="color: #1E40AF; margin-bottom: 15px; font-size: 20px;">
      Hello ${name ? name : recipient}
    </h2>
    
    <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
      ${message}
    </p>
    
    ${uploadedFiles.length > 0
            ? `
        <div style="background-color: #F3F4F6; border-top: 1px solid #E5E7EB; padding: 15px; border-radius: 8px; margin-top: 20px;">
          <h3 style="color: #1E40AF; margin-bottom: 10px; font-size: 16px;">Attached Files:</h3>
          ${uploadedFiles
                .map((file) => `
            <a href="${file}" style="color: #3B82F6; text-decoration: none; display: block; margin-bottom: 5px; overflow: hidden; text-overflow: ellipsis;">
              📄 ${file.split("/").pop()}
            </a>
          `)
                .join("")}
        </div>
        `
            : ""}
  </div>
  
  <div style="text-align: center; color: #6B7280; padding: 10px; font-size: 12px;">
    © ${new Date().getFullYear()} Going Nepal Adventure
  </div>
</div>
      `;
        sendSingleEmail(recipient, subject, mailContent);
        await PlanTrip.findOneAndUpdate({ _id: req.params.id }, {
            $set: { status: "mailed" },
        });
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Email sent successfully",
            attachmentCount: uploadedFiles.length,
        });
    }
    catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to send email",
        });
    }
};
export default sendMail;
