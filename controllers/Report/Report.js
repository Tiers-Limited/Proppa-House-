const Report = require("../../models/Report");
const User = require("../../models/Users");
const { transporter } = require("../../utils/nodemailer");

exports.addReport = async (req, res) => {
  try {
    const { userId, clientId, reportContent } = req.body;

    if (!userId || !clientId || !reportContent) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const newReport = new Report({
      userId,
      clientId,
      status: "Pending",
      reportContent,
    });
    await newReport.save();

    const reporter = await User.findById(userId);
    const reportedClient = await User.findById(clientId);

    const formattedTime = new Date(newReport.timeStamp).toLocaleString(
      "en-US",
      {
        dateStyle: "long",
        timeStyle: "short",
      }
    );

    const userEmailTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Issue Report Submitted</title>
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
    
    <div class="header">Issue Report Submitted</div>

    <div class="content">
        <p>Hello <strong>${reporter.name}</strong>,</p>
        <p>Your report against <strong>${reportedClient.name} (Client Id: ${clientId})</strong> has been submitted successfully.</p>
        <p><strong>Report Message:</strong></p>
        <p class="message-box">"${reportContent}"</p>
        <p><strong>Reported On:</strong> ${formattedTime}</p>
        <p>Our team will review the issue and take the necessary action.</p>
    </div>

    <div style="margin-top: 30px; text-align: left;">
        <p style="margin: 0;">Best Regards,</p>
        <p style="margin: 0;"><strong>Complaints Resolution Team,</strong></p>
        <p style="margin: 0;">Founder,<br>Proppa House</p>
    </div>

    <div style="margin-top: 20px; text-align: left;">
        <a href="https://linkedin.com" style="margin-right: 8px; display: inline-block;">
            <img src="https://cdn-icons-png.flaticon.com/16/174/174857.png" alt="LinkedIn" style="width: 16px; height: 16px;">
        </a>
        <a href="https://facebook.com" style="margin-right: 8px; display: inline-block;">
            <img src="https://cdn-icons-png.flaticon.com/16/733/733547.png" alt="Facebook" style="width: 16px; height: 16px;">
        </a>
        <a href="https://instagram.com" style="margin-right: 8px; display: inline-block;">
            <img src="https://cdn-icons-png.flaticon.com/16/2111/2111463.png" alt="Instagram" style="width: 16px; height: 16px;">
        </a>
        <a href="https://twitter.com" style="margin-right: 8px; display: inline-block;">
            <img src="https://cdn-icons-png.flaticon.com/16/733/733579.png" alt="Twitter" style="width: 16px; height: 16px;">
        </a>
        <a href="https://youtube.com" style="margin-right: 8px; display: inline-block;">
            <img src="https://cdn-icons-png.flaticon.com/16/1384/1384060.png" alt="YouTube" style="width: 16px; height: 16px;">
        </a>
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

    const adminEmailTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Issue Report Submitted</title>
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
            background: #f9f9f9;
            padding: 10px;
            border-left: 4px solid #e74c3c;
            margin: 15px 0;
            font-style: italic;
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
    <img src="${process.env.BACKEND_URI}/images/logoo.png" alt="Company Logo" class="logo">

    <div class="header">Issue Report Submitted</div>

    <div class="content">
        <p>Hello <strong>Admin</strong>,</p>

        <p><strong>Reporter:</strong> ${reporter.name} (${reporter.email})</p>
        <p><strong>Reported User:</strong> ${reportedClient.name} (${reportedClient.email})</p>
        <p><strong>Client Id:</strong> ${clientId}</p>
        <p><strong>Message:</strong></p>
        <p class="message-box">"${reportContent}"</p>
        <p><strong>Reported On:</strong> ${formattedTime}</p>

        <p>Please review the issue and take appropriate action.</p>
    </div>

    <div style="margin-top: 30px; text-align: left;">
        <p style="margin: 0;">Best Regards,</p>
        <p style="margin: 0;"><strong>Complaints Resolution Team,</strong></p>
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
    const userMailOptions = {
      from: `Proppa House <${process.env.EMAIL_USER}>`,
      to: reporter.email,
      subject: "Issue Report Submitted",
      html: userEmailTemplate,
    };

    const adminMailOptions = {
      from: `Proppa House <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_US_EMAIL,
      subject: "New Issue Report Submitted",
      html: adminEmailTemplate,
    };

    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(adminMailOptions);

    return res.status(201).json({
      success: true,
      message: "Report submitted and emails sent successfully",
      data: newReport,
    });
  } catch (error) {
    console.error("Error submitting report:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit report",
      error: error.message,
    });
  }
};
