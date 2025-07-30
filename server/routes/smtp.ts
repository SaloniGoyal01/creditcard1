import { RequestHandler } from "express";

interface EmailRequest {
  to: string;
  subject: string;
  message: string;
  type?: "fraud-alert" | "otp" | "notification";
}

interface OTPRequest {
  email: string;
}

// Simulate SMTP email sending
export const sendEmail: RequestHandler = (req, res) => {
  const {
    to,
    subject,
    message,
    type = "notification",
  } = req.body as EmailRequest;

  if (!to || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: to, subject, message",
    });
  }

  // Simulate email sending process
  console.log("📧 SMTP EMAIL SIMULATION 📧");
  console.log("=".repeat(50));
  console.log("From: noreply@fraudguard-ai.com");
  console.log("To:", to);
  console.log("Subject:", subject);
  console.log("Type:", type);
  console.log("Message:");
  console.log(message);
  console.log("=".repeat(50));
  console.log("✅ Email sent successfully (simulated)");

  // Simulate delivery delay
  setTimeout(() => {
    res.json({
      success: true,
      message: "Email sent successfully",
      emailId: `email_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      delivered: true,
    });
  }, 1000);
};

// Send OTP email
export const sendOTP: RequestHandler = (req, res) => {
  const { email } = req.body as OTPRequest;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const emailBody = `
    <h2>🔐 FraudGuard AI - Login Verification</h2>
    <p>Your One-Time Password (OTP) for secure login:</p>
    <div style="font-size: 32px; font-weight: bold; color: #00bcd4; text-align: center; padding: 20px; background: #f0f0f0; border-radius: 8px; margin: 20px 0;">
      ${otp}
    </div>
    <p><strong>Valid for 5 minutes only.</strong></p>
    <p>If you didn't request this OTP, please ignore this email.</p>
    <br>
    <p>Best regards,<br>FraudGuard AI Security Team</p>
  `;

  // Simulate SMTP sending
  console.log("📧 OTP EMAIL SIMULATION 📧");
  console.log("=".repeat(50));
  console.log("From: security@fraudguard-ai.com");
  console.log("To:", email);
  console.log("Subject: Your FraudGuard AI Login OTP");
  console.log("OTP Generated:", otp);
  console.log("HTML Body:", emailBody);
  console.log("=".repeat(50));
  console.log("✅ OTP Email sent successfully (simulated)");

  res.json({
    success: true,
    message: "OTP email sent successfully",
    otpId: `otp_${Math.random().toString(36).substr(2, 9)}`,
    // In real app, don't send OTP back to client!
    // This is only for demo purposes
    otp: "123456", // Demo OTP for testing
    expiresIn: 300, // 5 minutes
    timestamp: new Date().toISOString(),
  });
};

// Send fraud alert email
export const sendFraudAlert: RequestHandler = (req, res) => {
  const {
    email,
    transactionId,
    amount,
    merchant,
    location,
    riskScore,
    reason,
  } = req.body;

  const alertEmail = `
    <div style="background: #1a1a1a; color: #ffffff; padding: 20px; font-family: Arial, sans-serif;">
      <h1 style="color: #ff4444; text-align: center;">🚨 FRAUD ALERT 🚨</h1>
      
      <div style="background: #333; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #00bcd4;">Suspicious Transaction Detected</h2>
        
        <table style="width: 100%; color: #ffffff;">
          <tr>
            <td><strong>Transaction ID:</strong></td>
            <td>${transactionId}</td>
          </tr>
          <tr>
            <td><strong>Amount:</strong></td>
            <td style="color: #ff4444; font-size: 18px;">₹${amount?.toLocaleString()}</td>
          </tr>
          <tr>
            <td><strong>Merchant:</strong></td>
            <td>${merchant}</td>
          </tr>
          <tr>
            <td><strong>Location:</strong></td>
            <td>${location}</td>
          </tr>
          <tr>
            <td><strong>Risk Score:</strong></td>
            <td style="color: ${riskScore >= 80 ? "#ff4444" : riskScore >= 60 ? "#ffaa00" : "#44ff44"};">
              ${riskScore}/100
            </td>
          </tr>
          <tr>
            <td><strong>Reason:</strong></td>
            <td style="color: #ffaa00;">${reason}</td>
          </tr>
          <tr>
            <td><strong>Time:</strong></td>
            <td>${new Date().toLocaleString()}</td>
          </tr>
        </table>
      </div>
      
      <div style="background: #ff4444; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0; color: #ffffff;">⚠️ Action Taken</h3>
        <p style="margin: 10px 0; color: #ffffff;">This transaction has been automatically blocked by our AI system.</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <p>Your account remains secure. No action required from your side.</p>
        <p style="color: #888;">If you have any questions, contact our 24/7 security helpline.</p>
      </div>
      
      <hr style="border: 1px solid #444;">
      <p style="text-align: center; color: #888; font-size: 12px;">
        FraudGuard AI - Advanced Fraud Detection System<br>
        This is an automated security alert. Please do not reply to this email.
      </p>
    </div>
  `;

  // Simulate SMTP sending
  console.log("🚨 FRAUD ALERT EMAIL SIMULATION 🚨");
  console.log("=".repeat(60));
  console.log("From: alerts@fraudguard-ai.com");
  console.log("To:", email);
  console.log("Subject: 🚨 URGENT - Fraudulent Transaction Blocked");
  console.log("Priority: High");
  console.log("HTML Body Generated");
  console.log("=".repeat(60));
  console.log("✅ Fraud Alert Email sent successfully (simulated)");

  res.json({
    success: true,
    message: "Fraud alert email sent successfully",
    alertId: `alert_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    recipientCount: 1,
  });
};

// Test SMTP configuration
export const testSMTP: RequestHandler = (req, res) => {
  const testEmail = {
    to: "test@example.com",
    subject: "🧪 FraudGuard AI - SMTP Test Email",
    message: `
      <h2>✅ SMTP Configuration Test</h2>
      <p>This is a test email to verify SMTP functionality.</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>Status:</strong> <span style="color: green;">Working correctly</span></p>
      <hr>
      <p style="color: #666; font-size: 12px;">
        FraudGuard AI - Email System Test
      </p>
    `,
    type: "notification" as const,
  };

  // Simulate successful SMTP test
  console.log("🧪 SMTP TEST EMAIL SIMULATION 🧪");
  console.log("=".repeat(50));
  console.log("SMTP Server: smtp.fraudguard-ai.com:587");
  console.log("Authentication: SUCCESSFUL (simulated)");
  console.log("TLS/SSL: Enabled");
  console.log("Test Email Details:", testEmail);
  console.log("=".repeat(50));
  console.log("✅ SMTP Test completed successfully");

  res.json({
    success: true,
    message: "SMTP test completed successfully",
    config: {
      server: "smtp.fraudguard-ai.com",
      port: 587,
      secure: true,
      authenticated: true,
    },
    testResult: {
      emailSent: true,
      deliveryTime: "< 2 seconds",
      timestamp: new Date().toISOString(),
    },
  });
};
