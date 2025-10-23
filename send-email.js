// netlify/functions/send-email.js
const nodemailer = require("nodemailer");

exports.handler = async function (event, context) {
  try {
    const data = JSON.parse(event.body || "{}");
    const { name, email, street, houseNumber, zip, city, product } = data;

    if (!email || !name || !product) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    // Create transporter using Gmail and App Password stored in env var
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "somakombuchamaas@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Customer confirmation email
    const customerMessage = {
      from: "SOMA Kombucha <somakombuchamaas@gmail.com>",
      to: email,
      subject: "Your SOMA Kombucha Order Confirmation 🍹",
      text: `Hi ${name},

Thanks for your order of ${product}!

Delivery address:
${street} ${houseNumber}
${zip} ${city}

If you need to change anything, reply to this email.

Love,
SOMA Kombucha`,
    };

    // Notification email to you
    const ownerMessage = {
      from: "SOMA Kombucha <somakombuchamaas@gmail.com>",
      to: "somakombuchamaas@gmail.com",
      subject: "New Order Received 🚚",
      text: `New order received:
Name: ${name}
Customer email: ${email}
Product: ${product}
Address: ${street} ${houseNumber}, ${zip} ${city}`,
    };

    // Send both emails (await to catch errors)
    await transporter.sendMail(customerMessage);
    await transporter.sendMail(ownerMessage);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Emails sent" }),
    };
  } catch (err) {
    console.error("send-email error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send emails" }),
    };
  }
};
