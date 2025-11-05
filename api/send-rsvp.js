import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle OPTIONS request for CORS
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, guests, message } = req.body;

  // Validate required fields
  if (!name || !email || !guests) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Check if environment variables are set
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error("Missing environment variables");
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    // Create transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Verify transporter configuration
    await transporter.verify();

    // Email content - UPDATED: Correct email address
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: "villarinedoloverio@gmail.com", // email
      subject: `Wedding RSVP from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #a3b18a; border-bottom: 2px solid #c7b98e; padding-bottom: 10px;">
            New Wedding RSVP - Tiphanie & Jeralde
          </h2>
          
          <div style="background: #f7f6f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2f3a32; margin-top: 0;">Guest Information</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; width: 120px;">Name:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Number of Guests:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${guests}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Message:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
                  message || "No message provided"
                }</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Submitted:</td>
                <td style="padding: 8px;">${new Date().toLocaleString()}</td>
              </tr>
            </table>
          </div>
          
          <footer style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #6f7f61; font-size: 12px;">
            <p>This RSVP was submitted through your wedding website.</p>
          </footer>
        </div>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);

    res.status(200).json({
      success: true,
      message: "RSVP sent successfully!",
    });
  } catch (error) {
    console.error("Error sending email:", error);

    // More specific error messages
    let errorMessage = "Failed to send RSVP. Please try again.";

    if (error.code === "EAUTH") {
      errorMessage =
        "Email authentication failed. Check your Gmail App Password.";
    } else if (error.code === "ECONNECTION") {
      errorMessage = "Connection error. Please check your internet connection.";
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
