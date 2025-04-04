const { transporter } = require("../../../utils/nodemailer");

const sendEmail = async (to, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: `Proppa House <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const getEmailTemplate = (
  receiverName,
  issue,
  username,
  useremail,
  timestamp,
  isAdmin
) => {
  return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Support Request</title>
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
                  text-align: left;
              }
              .footer a {
                  color: #44ccff;
                  text-decoration: none;
              }
              .social-icons img {
                  width: 16px;
                  height: 16px;
                  margin-right: 8px;
                  display: inline-block;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <img src="logoo.png" alt="Company Logo" class="logo">
              <div class="header">${
                isAdmin ? "New Support Request" : "Support Request Received"
              }</div>
              <div class="content">
                  <p>Hello <strong>${receiverName}</strong>,</p>
                  ${
                    isAdmin
                      ? `
                  <p><strong>Reporter:</strong> ${username} (${useremail})</p>
                  <p><strong>Issue:</strong></p>
                  <p class="message-box">"${issue}"</p>
                  <p><strong>Reported On:</strong> ${timestamp}</p>
                  <p>Please review the issue and take appropriate action.</p>`
                      : `
                  <p>We have received your request and will get back to you shortly.</p>
                  <p><strong>Your Issue:</strong></p>
                  <p class="message-box">"${issue}"</p>
                  <p>Thank you for reaching out.</p>`
                  }
              </div>
              <div style="margin-top: 30px; text-align: left;">
                  <p style="margin: 0;">Best Regards,</p>
                  <p style="margin: 0;"><strong>Asare Abanquah-Asare</strong></p>
                  <p style="margin: 0;">Founder,<br>Proppa House</p>
              </div>
              <div class="social-icons" style="margin-top: 20px; text-align: left;">
                  <a href="https://linkedin.com"><img src="https://cdn-icons-png.flaticon.com/16/174/174857.png" alt="LinkedIn"></a>
                  <a href="https://facebook.com"><img src="https://cdn-icons-png.flaticon.com/16/733/733547.png" alt="Facebook"></a>
                  <a href="https://instagram.com"><img src="https://cdn-icons-png.flaticon.com/16/2111/2111463.png" alt="Instagram"></a>
                  <a href="https://twitter.com"><img src="https://cdn-icons-png.flaticon.com/16/733/733579.png" alt="Twitter"></a>
                  <a href="https://youtube.com"><img src="https://cdn-icons-png.flaticon.com/16/1384/1384060.png" alt="YouTube"></a>
              </div>

              <div style="margin-top: 30px; font-size: 12px; color: #777; text-align: left; border-top: 1px solid #ddd; padding-top: 10px;">
        <p>This email is confidential and intended only for the named recipient. If received in error, please delete it and notify the sender.</p>
        <p>We process personal data in line with UK GDPR — see our <a href="https://your-privacy-policy-link.com" style="color: #44ccff; text-decoration: none;">Privacy Policy</a> for more details.</p>
        <p>Proppa House Ltd, Registered in England & Wales. Company No: 15771237.</p>
    </div>

              <div class="footer">
                  <p>Proppa House 2025</p>
              </div>
          </div>
      </body>
      </html>
    `;
};

exports.Support = async (req, res) => {
  const { issue, username, useremail } = req.body;
  const timestamp = new Date().toLocaleString();

  if (!issue || !username || !useremail) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const adminEmailTemplate = getEmailTemplate(
    "Admin",
    issue,
    username,
    useremail,
    timestamp,
    true
  );
  const userEmailTemplate = getEmailTemplate(
    username,
    issue,
    username,
    useremail,
    timestamp,
    false
  );

  await sendEmail(
    process.env.ADMIN_SUPPORT_EMAIL,
    "New Support Request",
    adminEmailTemplate
  );
  await sendEmail(useremail, "Support Request Received", userEmailTemplate);

  res.status(200).json({ message: "Support request sent successfully" });
};
