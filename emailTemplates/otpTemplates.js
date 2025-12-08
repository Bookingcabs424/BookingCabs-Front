const companyName = process.env.EMAIL_COMPANY_NAME;
export const otpEmailTemplate = (userName = "User", otp = "123456") => {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #2c3e50;">Hi ${userName},</h2>
        <p style="font-size: 16px; color: #333;">
          Thank you for registering with us! Please use the OTP below to verify your account:
        </p>
        <div style="margin: 30px 0; text-align: center;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2e86de;">${otp}</span>
        </div>
        <p style="font-size: 14px; color: #888;">
          This OTP will expire in 5 minutes. Do not share it with anyone for security reasons.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="font-size: 12px; color: #aaa; text-align: center;">
          If you didn’t request this, please ignore this email.
          <br>
          &copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.
        </p>
      </div>
    `;
};
