const Contact = require("../../../models/Contact");
const { transporter } = require("../../../utils/nodemailer");

exports.submitContactForm = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, message } = req.body;

    const contact = new Contact({
      firstName,
      lastName,
      email,
      phoneNumber,
      message,
    });
    await contact.save();

    const userEmailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Contact Us - Confirmation</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 20px auto;
                  background: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                  text-align: center;
              }
              .logo {
                  width: 150px;
                  margin-bottom: 15px;
              }
              .header {
                  font-size: 22px;
                  font-weight: bold;
                  color: #44ccff;
                  margin-bottom: 15px;
              }
              .content {
                  font-size: 16px;
                  color: #333333;
                  line-height: 1.5;
                  text-align: left;
              }
              .message-box {
                  background: #f8f8f8;
                  padding: 10px;
                  border-left: 4px solid #44ccff;
                  margin: 15px 0;
              }
              .footer {
                  font-size: 14px;
                  color: #777777;
                  padding: 10px;
                  border-top: 1px solid #dddddd;
                  margin-top: 20px;
              }
              .footer a {
                  color: #44ccff;
                  text-decoration: none;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <img src="${process.env.BACKEND_URI}/images/logoo.png" alt="Company Logo" class="logo">
              <div class="header">Thank You for Contacting Us!</div>
              <div class="content">
                  <p>Hello <strong>${firstName} ${lastName}</strong>,</p>
                  <p>We have received your message and will get back to you shortly.</p>
                  <p><strong>Your Message:</strong></p>
                  <p class="message-box">"${message}"</p>
                  <p>If this was not you, please ignore this email or contact our support team.</p>
              </div>
              <div class="footer">
                  &copy; 2025 Proppa House | <a href="https://yourcompany.com">Visit Website</a>
              </div>
          </div>
      </body>
      </html>
    `;

    const adminEmailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>New Contact Form Submission</title>
      </head>
      <body>
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone Number:</strong> ${phoneNumber}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
      </body>
      </html>
    `;

    // Send email to user
    const userMailOptions = {
      from: `Proppa House <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank You for Contacting Us!",
      html: userEmailTemplate,
    };

    // Send email to admin
    const adminMailOptions = {
      from: `Proppa House <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_US_EMAIL, // Admin email
      subject: "New Contact Form Submission",
      html: adminEmailTemplate,
    };

    // Send emails asynchronously
    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(adminMailOptions);

    return res
      .status(200)
      .json({ message: "Contact form submitted successfully!" });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while submitting the form." });
  }
};
