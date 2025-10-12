import nodemailer from 'nodemailer';

/**
 * Nodemailer transporter configuration for sending emails via Gmail.
 * Uses environment variables for authentication credentials.
 */
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Gmail account username from environment variables
        pass: process.env.EMAIL_PASSWORD // Gmail app password from environment variables
    }
});

/**
 * Sends a password reset email with a secure reset token and styled HTML content.
 * 
 * @param {string} email - Recipient's email address
 * @param {string} resetToken - Secure token for password reset validation
 * @returns {Promise<Object>} Object indicating success or failure of email sending
 * @throws {Error} If email sending fails
 */
export const sendPasswordResetEmail = async (email, resetToken) => {
    try {
        // Construct reset URL with token for frontend password reset page
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        
        // Email configuration with HTML content
        const mailOptions = {
            from: {
                name: 'Lanka Pharmacy',
                address: process.env.EMAIL_USER
            },
            to: email,
            subject: 'Password Reset Request - Lanka Pharmacy',
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - Lanka Pharmacy</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #374151;
            background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdf4 100%);
            margin: 0;
            padding: 20px;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            border: 1px solid #e5e7eb;
        }
        
        .email-header {
            background: linear-gradient(135deg, #059669 0%, #065f46 100%);
            padding: 40px 32px;
            text-align: center;
            color: white;
        }
        
        .logo {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 16px;
            letter-spacing: -0.025em;
        }
        
        .email-title {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.025em;
        }
        
        .email-subtitle {
            font-size: 16px;
            font-weight: 400;
            opacity: 0.9;
        }
        
        .email-body {
            padding: 40px 32px;
        }
        
        .content-section {
            margin-bottom: 32px;
        }
        
        .greeting {
            font-size: 18px;
            font-weight: 500;
            color: #374151;
            margin-bottom: 24px;
        }
        
        .instruction {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 24px;
            line-height: 1.7;
        }
        
        .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #059669 0%, #065f46 100%);
            color: white !important; /* Force white text for better contrast */
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 16px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 24px 0;
            box-shadow: 0 4px 6px -1px rgba(5, 150, 105, 0.2);
            transition: all 0.3s ease;
            border: none; /* Remove any default borders */
        }
        
        .reset-link {
            display: block;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 16px;
            margin: 20px 0;
            word-break: break-all;
            font-size: 14px;
            color: #475569;
            text-align: center;
        }
        
        .info-box {
            background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
            border: 1px solid #a7f3d0;
            border-radius: 16px;
            padding: 20px;
            margin: 24px 0;
        }
        
        .info-title {
            font-weight: 600;
            color: #065f46;
            margin-bottom: 8px;
            font-size: 16px;
        }
        
        .info-text {
            color: #047857;
            font-size: 14px;
            line-height: 1.6;
        }
        
        .warning-box {
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 12px;
            padding: 16px;
            margin: 20px 0;
        }
        
        .warning-text {
            color: #dc2626;
            font-size: 14px;
            text-align: center;
            font-weight: 500;
        }
        
        .footer {
            text-align: center;
            padding: 32px;
            background: #f8fafc;
            border-top: 1px solid #e5e7eb;
        }
        
        .footer-text {
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 8px;
        }
        
        .contact-info {
            color: #9ca3af;
            font-size: 12px;
            margin-top: 16px;
        }
        
        /* Responsive design for mobile devices */
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            
            .email-header {
                padding: 32px 24px;
            }
            
            .email-body {
                padding: 32px 24px;
            }
            
            .email-title {
                font-size: 24px;
            }
            
            .reset-button {
                padding: 14px 28px;
                font-size: 15px;
            }
        }
    </style>
</head>
<body>
    <!-- Email Container -->
    <div class="email-container">
        <!-- Header Section with Branding -->
        <div class="email-header">
            <div class="logo">💊 Lanka Pharmacy</div>
            <h1 class="email-title">Password Reset Request</h1>
            <p class="email-subtitle">Your Trusted Healthcare Partner</p>
        </div>
        
        <!-- Main Content Section -->
        <div class="email-body">
            <div class="content-section">
                <p class="greeting">Hello,</p>
                
                <p class="instruction">
                    We received a request to reset your password for your Lanka Pharmacy account. 
                    Click the button below to create a new password:
                </p>
                
                <!-- Reset Button Container -->
                <div style="text-align: center;">
                    <a href="${resetUrl}" class="reset-button">
                        🔐 Reset Your Password
                    </a>
                </div>
                
                <!-- Alternative Reset Link for copy-paste -->
                <div class="reset-link">
                    ${resetUrl}
                </div>
                
                <!-- Security Information Box -->
                <div class="info-box">
                    <div class="info-title">⏰ Important Notice</div>
                    <p class="info-text">
                        This password reset link will expire in <strong>1 hour</strong> for your security. 
                        If you don't use it within this time, you'll need to request a new reset link.
                    </p>
                </div>
            </div>
            
            <!-- Security Warning Box -->
            <div class="warning-box">
                <p class="warning-text">
                    ⚠️ If you didn't request this password reset, please ignore this email. 
                    Your account remains secure.
                </p>
            </div>
        </div>
        
        <!-- Footer Section -->
        <div class="footer">
            <p class="footer-text">
                <strong>Lanka Pharmacy</strong><br>
                Your Trusted Healthcare Partner
            </p>
            <p class="footer-text">
                This is an auto-generated email. Please do not reply to this message.
            </p>
            <p class="contact-info">
                Need help? Contact us at lp.hatton.sup@gmail.com
            </p>
        </div>
    </div>
</body>
</html>
            `
        };

        // Send email using configured transporter
        await transporter.sendMail(mailOptions);
        console.log(`✅ Password reset email sent to: ${email}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Error sending password reset email:', error);
        throw new Error('Failed to send password reset email');
    }
};