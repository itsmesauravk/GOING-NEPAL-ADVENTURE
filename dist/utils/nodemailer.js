import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: `${process.env.AUTH_EMAIL}`,
        pass: `${process.env.AUTH_PASSWORD}`,
    },
});
// single user mail send
const sendSingleEmail = (email, subject, content) => {
    try {
        let mailOptions = {
            from: `${process.env.AUTH_EMAIL}`,
            to: email,
            subject: subject,
            html: content,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return false;
            }
            else {
                console.log("Email sent: " + info.response);
                return true;
            }
        });
    }
    catch (error) {
        console.log(error);
    }
};
// multi user mail send (bulk mail)
const sendBulkEmail = async (emails, // Array of email addresses eg ["email1@gmail.com", "email2@gmail.com"]
subject, // Email subject
content) => {
    try {
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: emails.join(","), // Convert array to comma-separated string
            subject: subject,
            html: content, // Use HTML content for better email formatting
        };
        // Send the email and await the promise
        return await transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.error("Error sending bulk email:", error);
        throw new Error("Failed to send email.");
    }
};
export { sendSingleEmail, sendBulkEmail };
