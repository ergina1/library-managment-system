export function generateVerificationOtpEmailTemplate(otpCode){
    return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1e1e1e; border-radius: 8px;">
    <h2 style="color: #fff; text-align: center;">Verify Your Email Address</h2>
    <p style="font-size: 16px; color: #ccc;">Dear User,</p>
    <p style="font-size: 16px; color: #ccc;">To complete your registration or login, please use the following One-Time Password (OTP):</p>
    
    <div style="text-align: center; margin: 20px 0;">
        <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #000; background-color: #fff; padding: 10px 20px; border-radius: 4px;">
            ${otpCode}
        </span>
    </div>
    
    <p style="font-size: 16px; color: #ccc;">This code is valid for 15 minutes. Please do not share this code with anyone.</p>
    <p style="font-size: 16px; color: #ccc;">If you did not request this email, please ignore it.</p>
    
    <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #666;">
        <p>Thank you,<br>BookNorm Team</p>
        <p style="font-size: 12px; color: #444;">This is an automated message. Please do not reply to this email.</p>
    </footer>
</div>`
}

export function generateForgotPasswordEmailTemplate(resetPasswordUrl) {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; padding: 20px; border: 1px solid #444; background-color: #1a1a1a; color: #fff; border-radius: 8px;">
        <h2 style="color: #fff; text-align: center;">Reset Your Password</h2>
        
        <p style="font-size: 16px; color: #ccc;">Dear User,</p>
        
        <p style="font-size: 16px; color: #ccc;">You requested to reset your password. Please click the button below to create a new password:</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${resetPasswordUrl}" 
               style="display: inline-block; font-size: 16px; font-weight: bold; color: #000; text-decoration: none; background-color: #3498db; padding: 12px 24px; border-radius: 5px;">
                Reset Password
            </a>
        </div>
        
        <p style="font-size: 16px; color: #ccc;">If you did not request this, please ignore this email. The link will expire in 15 minutes.</p>
        
        <p style="font-size: 16px; color: #ccc;">If the button above doesn't work, copy and paste the following link into your browser:</p>
        
        <p style="font-size: 16px; color: #fff; word-wrap: break-word; background-color: #2a2a2a; padding: 10px; border-radius: 4px;">
            ${resetPasswordUrl}
        </p>
        
        <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #666;">
            <p>Thank you,<br><strong>Library Team</strong></p>
        </footer>
    </div>
    `;
}