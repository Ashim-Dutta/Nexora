const { subscribeToQueue } = require('./broker')
const {sendEmail} = require('../email')


module.exports = function () {
    subscribeToQueue('AUTH_NOTIFICATION.USER_CREATED', async(data) => {
   const emailHTMLTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:30px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background-color:#0f172a; padding:24px; text-align:center;">
              <h1 style="margin:0; font-size:24px; color:#ffffff;">
                Welcome to Our Platform 🎉
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px; color:#334155; font-size:15px; line-height:1.6;">
              <p style="margin-top:0;">
                Dear <strong>${data.fullName.firstName} ${data.fullName.lastName || ""}</strong>,
              </p>

              <p>
                Thank you for registering with us. We’re excited to have you on board and can’t wait for you to explore everything our platform has to offer.
              </p>

              <p>
                If you have any questions or need assistance, feel free to reach out to our support team at any time.
              </p>

              <p style="margin-bottom:0;">
                We’re glad to have you with us!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc; padding:20px; text-align:center; font-size:13px; color:#64748b;">
              <p style="margin:0;">
                Best regards,<br />
                <strong>Notification Service Team</strong>
              </p>
              <p style="margin:8px 0 0;">
                © ${new Date().getFullYear()} Notification Service. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`;
        
        await sendEmail(data.email, "Welcome to our platform", "Thank you for registering with us. We’re excited to have you on board and can’t wait for you to explore everything our platform has to offer.",emailHTMLTemplate)

   
})
}