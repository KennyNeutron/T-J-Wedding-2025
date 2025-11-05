// api/rsvp.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, guests, message } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required." });
  }

  // configure transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER, // your gmail address
      pass: process.env.MAIL_PASS, // app password
    },
  });

  const mailOptions = {
    from: `"Wedding RSVP" <${process.env.MAIL_USER}>`,
    to: "villarinedoloverio@gmail.com",
    subject: `New RSVP from ${name}`,
    text: `
New RSVP submitted:

Name: ${name}
Email: ${email}
No. of guests: ${guests || "1"}
Message: ${message || "—"}

Sent: ${new Date().toISOString()}
    `.trim(),
    html: `
      <h2>New Wedding RSVP</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>No. of Guests:</strong> ${guests || "1"}</p>
      <p><strong>Message:</strong><br />${
        message ? message.replace(/\n/g, "<br>") : "—"
      }</p>
      <p style="font-size:12px;color:#888;margin-top:20px;">Sent ${new Date().toISOString()}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "RSVP sent" });
  } catch (err) {
    console.error("RSVP mail error:", err);
    return res.status(500).json({ message: "Failed to send RSVP" });
  }
}
