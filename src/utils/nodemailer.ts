import nodemailer from "nodemailer"

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: `${process.env.AUTH_EMAIL}`,
    pass: `${process.env.AUTH_PASSWORD}`,
  },
})

// single user mail send

const sendSingleEmail = (email: string, subject: string, content: string) => {
  try {
    let mailOptions = {
      from: `${process.env.AUTH_EMAIL}`,
      to: email,
      subject: subject,
      html: content,
    }
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
        return false
      } else {
        console.log("Email sent: " + info.response)
        return true
      }
    })
  } catch (error) {
    console.log(error)
  }
}

// multi user mail send (bulk mail)

const sendBulkEmail = async (
  email: string[],
  subject: string,
  content: string
) => {
  try {
    let mailOptions = {
      from: `${process.env.AUTH_EMAIL}`,
      to: email,
      subject: subject,
      text: content,
    }
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
        return false
      } else {
        console.log("Email sent: " + info.response)
        return true
      }
    })
  } catch (error) {
    console.log(error)
  }
}

export { sendSingleEmail, sendBulkEmail }
