import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Reusable Brevo sender function
async function sendViaBrevo({ subject, htmlContent, replyToEmail }) {
  const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: {
        name: "Portfolio Contact",
        email: process.env.BREVO_SENDER_EMAIL, // must be a verified sender in Brevo
      },
      to: [{ email: process.env.RECEIVER_EMAIL }],
      replyTo: replyToEmail ? { email: replyToEmail } : undefined,
      subject,
      htmlContent,
    }),
  });

  if (!brevoRes.ok) {
    const errText = await brevoRes.text();
    console.error("Brevo error:", errText);
    throw new Error("Email failed");
  }
}

app.post("/send-mail", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
</head>

<body style="
  margin:0;
  padding:0;
  background:#0b0f14;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial;
  color:#1f2937;
">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:48px 18px;">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:720px;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:36px;">
              <h1 style="
                margin:0;
                font-size:32px;
                font-weight:700;
                color:#1f8f65;
              ">
                You’ve got a new message

              </h1>

              <p style="
                margin:14px auto 0;
                max-width:560px;
                font-size:17px;
                line-height:1.6;
                color:#4b5563;
              ">
               Someone contacted you through your portfolio.

              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:20px 0;">
<div style="height:3px;background:#2a3a34;"></div>

            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td>

              <!-- Name -->
              <p style="
  margin:0;
  font-size:12px;
  letter-spacing:0.08em;
  text-transform:uppercase;
  color:#9ca3af;
">
  NAME
</p>

<p style="
  margin:8px 0 24px;
  font-size:22px;
  font-weight:600;
  color:#f9fafb;
">
  ${name}
</p>


              <!-- Email -->
              <p style="
  margin:0;
  font-size:12px;
  letter-spacing:0.08em;
  text-transform:uppercase;
  color:#9ca3af;
">
  EMAIL
</p>

<p style="
  margin:8px 0 24px;
  font-size:19px;
  font-weight:500;
  color:#4ade80;
">
  ${email}
</p>


              <!-- Message -->
             <p style="
  margin:0;
  font-size:12px;
  letter-spacing:0.08em;
  text-transform:uppercase;
  color:#9ca3af;
">
  MESSAGE
</p>

<p style="
  margin:8px 0 24px;
  font-size:18px;
  line-height:1.7;
  color:#f9fafb;
">
  ${message}
</p>


            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:32px;">
<div style="height:3px;background:#2a3a34;"></div>
              
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

    await sendViaBrevo({
      subject: `New Message from ${name}`,
      htmlContent: emailHtml,
      replyToEmail: email,
    });

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Email failed" });
  }
});

// New route: Code Access Request from portfolio project cards
app.post("/request-code-access", async (req, res) => {
  const { name, email, projectTitle, message } = req.body;

  if (!name || !email || !projectTitle) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
</head>

<body style="
  margin:0;
  padding:0;
  background:#0b0f14;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial;
  color:#1f2937;
">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:48px 18px;">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:720px;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:36px;">
              <h1 style="
                margin:0;
                font-size:30px;
                font-weight:700;
                color:#1f8f65;
              ">
                Code Access Requested
              </h1>

              <p style="
                margin:14px auto 0;
                max-width:560px;
                font-size:17px;
                line-height:1.6;
                color:#4b5563;
              ">
               Someone wants to view the private repository for <strong>${projectTitle}</strong>.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 0;">
              <div style="height:3px;background:#2a3a34;"></div>
            </td>
          </tr>

          <tr>
            <td>
              <p style="margin:0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9ca3af;">PROJECT</p>
              <p style="margin:8px 0 24px;font-size:22px;font-weight:600;color:#f9fafb;">${projectTitle}</p>

              <p style="margin:0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9ca3af;">NAME</p>
              <p style="margin:8px 0 24px;font-size:20px;font-weight:600;color:#f9fafb;">${name}</p>

              <p style="margin:0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9ca3af;">EMAIL</p>
              <p style="margin:8px 0 24px;font-size:19px;font-weight:500;color:#4ade80;">${email}</p>

              ${
                message
                  ? `<p style="margin:0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9ca3af;">MESSAGE</p>
                     <p style="margin:8px 0 24px;font-size:18px;line-height:1.7;color:#f9fafb;">${message}</p>`
                  : ""
              }
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-top:32px;">
              <div style="height:3px;background:#2a3a34;"></div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`;

    await sendViaBrevo({
      subject: `Code Access Request - ${projectTitle}`,
      htmlContent: emailHtml,
      replyToEmail: email,
    });

    res
      .status(200)
      .json({ success: true, message: "Request sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Request failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));