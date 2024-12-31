export const otpSubject = "OTP for email verification"

interface VerificationEmailProps {
  otp: string
  verificationLink?: string
}

export const otpMailContent = ({
  otp,
  verificationLink,
}: VerificationEmailProps) => {
  return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 20px;">
        <h1 style="font-size: 24px; color: #000;">Verify your email address</h1>
        
         <p>We have received a sign-up attempt.</p>
        
        <p>To complete the sign-up process, enter the code in the original window:</p>
        
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 20px 0;">
          <strong>${otp}</strong>
        </p>
        
        ${
          verificationLink
            ? `
        <p>Or visit the link below to open the confirmation page in a new window or device:</p>
        <p><a href="${verificationLink}" style="color: #0070f3; text-decoration: none;">${verificationLink}</a></p>
        `
            : ""
        }
        
        <p style="color: #666; font-size: 14px; margin-top: 40px;">
          If you didn't request this email, you can safely ignore it.
          This verification code will expire in 10 minutes.
        </p>
      </div>
    `
}
