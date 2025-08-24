import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // or "SendGrid", "Mailgun", etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 2. Function to render EJS template
const renderTemplate = async (templateName, data) => {
  const filePath = path.join(__dirname, "./EmailTemplates", `${templateName}.ejs`);
  return await ejs.renderFile(filePath, data);
};

// 3. Main sendEmail function
export const sendEmail = async (to, subject, templateName, data) => {
  try {
    const htmlContent = await renderTemplate(templateName, data);

    const mailOptions = {
      from: `"EventHub" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent: ${subject} to ${to}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};
