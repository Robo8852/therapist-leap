import { api, APIError } from "encore.dev/api";
import { secret } from "encore.dev/config";
import type { EmailNotification } from "../shared/types";

// Email service configuration
// In production, configure these secrets in Encore/Leap
const emailAPIKey = secret("EmailAPIKey");
const emailFromAddress = secret("EmailFromAddress");

interface SendEmailRequest {
  to: string;
  subject: string;
  html_body: string;
  from?: string;
}

interface SendEmailResponse {
  success: boolean;
  message_id?: string;
}

/**
 * Send email notification
 * This is an internal API - should only be called by other services
 * TODO: Add internal-only authentication
 */
export const sendEmail = api(
  { expose: true, method: "POST", path: "/notifications/send-email" },
  async (req: SendEmailRequest): Promise<SendEmailResponse> => {
    // Validation
    if (!req.to || !isValidEmail(req.to)) {
      throw APIError.invalidArgument("Valid recipient email is required");
    }

    if (!req.subject || req.subject.trim().length === 0) {
      throw APIError.invalidArgument("Email subject is required");
    }

    if (!req.html_body || req.html_body.trim().length === 0) {
      throw APIError.invalidArgument("Email body is required");
    }

    const fromAddress = req.from || (await emailFromAddress());

    // TODO: Implement actual email sending
    // Options: SendGrid, AWS SES, Mailgun, etc.
    // For now, this is a placeholder that logs the email

    console.log("📧 Email to be sent:");
    console.log(`From: ${fromAddress}`);
    console.log(`To: ${req.to}`);
    console.log(`Subject: ${req.subject}`);
    console.log(`Body: ${req.html_body.substring(0, 100)}...`);

    // Placeholder for actual implementation:
    // const apiKey = await emailAPIKey();
    // const response = await sendViaProvider(apiKey, fromAddress, req.to, req.subject, req.html_body);

    return {
      success: true,
      message_id: `mock-${Date.now()}`, // Replace with actual message ID from provider
    };
  }
);

/**
 * Send contact form confirmation email to user
 */
export const sendContactConfirmation = api(
  { expose: true, method: "POST", path: "/notifications/contact-confirmation" },
  async (req: { name: string; email: string }): Promise<SendEmailResponse> => {
    const htmlBody = generateContactConfirmationEmail(req.name);

    return await sendEmail({
      to: req.email,
      subject: "Thank you for contacting Soul Synaptica",
      html_body: htmlBody,
    });
  }
);

/**
 * Send contact form notification to admin
 */
export const sendContactNotificationToAdmin = api(
  { expose: true, method: "POST", path: "/notifications/contact-admin" },
  async (req: {
    name: string;
    email: string;
    message: string;
  }): Promise<SendEmailResponse> => {
    const adminEmail = "connect@soulsynaptica.com"; // TODO: Move to config
    const htmlBody = generateContactAdminEmail(req.name, req.email, req.message);

    return await sendEmail({
      to: adminEmail,
      subject: `New Contact Form Submission from ${req.name}`,
      html_body: htmlBody,
    });
  }
);

/**
 * Send appointment confirmation email to patient
 */
export const sendAppointmentConfirmation = api(
  { expose: true, method: "POST", path: "/notifications/appointment-confirmation" },
  async (req: {
    patient_name: string;
    patient_email: string;
    preferred_date: string;
    preferred_time: string;
    service_type: string;
  }): Promise<SendEmailResponse> => {
    const htmlBody = generateAppointmentConfirmationEmail(
      req.patient_name,
      req.preferred_date,
      req.preferred_time,
      req.service_type
    );

    return await sendEmail({
      to: req.patient_email,
      subject: "Appointment Request Received - Soul Synaptica",
      html_body: htmlBody,
    });
  }
);

/**
 * Send appointment notification to admin
 */
export const sendAppointmentNotificationToAdmin = api(
  { expose: true, method: "POST", path: "/notifications/appointment-admin" },
  async (req: {
    patient_name: string;
    patient_email: string;
    patient_phone: string;
    preferred_date: string;
    preferred_time: string;
    service_type: string;
    message?: string;
  }): Promise<SendEmailResponse> => {
    const adminEmail = "connect@soulsynaptica.com"; // TODO: Move to config
    const htmlBody = generateAppointmentAdminEmail(
      req.patient_name,
      req.patient_email,
      req.patient_phone,
      req.preferred_date,
      req.preferred_time,
      req.service_type,
      req.message
    );

    return await sendEmail({
      to: adminEmail,
      subject: `New Appointment Request from ${req.patient_name}`,
      html_body: htmlBody,
    });
  }
);

// Email Templates

function generateContactConfirmationEmail(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #2C2C2C; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #6B4C9A; color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background-color: #F9F7FC; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Soul Synaptica</h1>
        </div>
        <div class="content">
          <h2>Thank you for reaching out, ${name}!</h2>
          <p>We have received your message and will get back to you as soon as possible.</p>
          <p>Our team typically responds within 24-48 hours during business days.</p>
          <p>If you need immediate assistance, please call us at <strong>+51 954 140 424</strong></p>
          <p>Best regards,<br>The Soul Synaptica Team</p>
        </div>
        <div class="footer">
          <p>Soul Synaptica | Lima, Perú | connect@soulsynaptica.com</p>
          <p>Compassion | Precision | Innovation | Integrity</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateContactAdminEmail(name: string, email: string, message: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #2C2C2C; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #6B4C9A; color: white; padding: 20px; }
        .content { padding: 20px; background-color: #F9F7FC; }
        .info { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Contact Form Submission</h2>
        </div>
        <div class="content">
          <div class="info">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          </div>
          <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateAppointmentConfirmationEmail(
  name: string,
  date: string,
  time: string,
  serviceType: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #2C2C2C; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #6B4C9A; color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background-color: #F9F7FC; }
        .appointment-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Soul Synaptica</h1>
        </div>
        <div class="content">
          <h2>Appointment Request Received</h2>
          <p>Dear ${name},</p>
          <p>We have received your appointment request. Our team will review it and contact you shortly to confirm.</p>
          <div class="appointment-details">
            <h3>Requested Appointment Details:</h3>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Service:</strong> ${serviceType}</p>
          </div>
          <p>If you need to make changes or have questions, please contact us at <strong>+51 954 140 424</strong> or reply to this email.</p>
          <p>Best regards,<br>The Soul Synaptica Team</p>
        </div>
        <div class="footer">
          <p>Soul Synaptica | Lima, Perú | connect@soulsynaptica.com</p>
          <p>Compassion | Precision | Innovation | Integrity</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateAppointmentAdminEmail(
  name: string,
  email: string,
  phone: string,
  date: string,
  time: string,
  serviceType: string,
  message?: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #2C2C2C; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #6B4C9A; color: white; padding: 20px; }
        .content { padding: 20px; background-color: #F9F7FC; }
        .info { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Appointment Request</h2>
        </div>
        <div class="content">
          <div class="info">
            <h3>Patient Information:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
          </div>
          <div class="info">
            <h3>Appointment Details:</h3>
            <p><strong>Preferred Date:</strong> ${date}</p>
            <p><strong>Preferred Time:</strong> ${time}</p>
            <p><strong>Service Type:</strong> ${serviceType}</p>
            ${message ? `<p><strong>Additional Message:</strong><br>${message}</p>` : ""}
          </div>
          <p><small>Request submitted at: ${new Date().toLocaleString()}</small></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Helper function
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
