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
        
      await sendEmail(data.email, "Welcome to our platform", "Thank you for registering with us. We’re excited to have you on board and can’t wait for you to explore everything our platform has to offer.", emailHTMLTemplate)
   
    })
  
  subscribeToQueue("PAYMENT_NOTIFICATION.PAYMENT_COMPLETED", async (data) => {
         
    const paymentSuccessHTMLTemplate = `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Payment Successful</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: Arial, Helvetica, sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
    }
    .header {
      background-color: #16a34a;
      color: #ffffff;
      padding: 20px;
      text-align: center;
      font-size: 22px;
      font-weight: bold;
    }
    .content {
      padding: 24px;
      color: #333333;
      font-size: 14px;
      line-height: 1.6;
    }
    .details {
      margin-top: 16px;
      background: #f9fafb;
      border-radius: 6px;
      padding: 16px;
    }
    .details p {
      margin: 6px 0;
    }
    .footer {
      text-align: center;
      padding: 16px;
      font-size: 12px;
      color: #6b7280;
      background: #f9fafb;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      Payment Successful
    </div>

    <div class="content">
      <p>Dear <strong>{{customerName}}</strong>,</p>

      <p>
        We are pleased to inform you that your payment has been successfully
        completed. Thank you for choosing <strong>{{companyName}}</strong>.
      </p>

      <div class="details">
        <p><strong>Order ID:</strong> {{orderId}}</p>
        <p><strong>Amount Paid:</strong> {{amount}}</p>
        <p><strong>Payment Method:</strong> {{paymentMethod}}</p>
        <p><strong>Transaction ID:</strong> {{transactionId}}</p>
        <p><strong>Date:</strong> {{paymentDate}}</p>
      </div>

      <p style="margin-top: 16px;">
        You can now access your purchased service or product as per your plan.
        If you have any questions, feel free to reach out to our support team.
      </p>

      <p>
        Regards,<br />
        <strong>{{companyName}} Support Team</strong>
      </p>
    </div>

    <div class="footer">
      © {{year}} {{companyName}}. All rights reserved.<br />
      This is an automated email. Please do not reply.
    </div>
  </div>
</body>
</html>

       `
        await sendEmail(data.email, "Payment Successful", "Thank you for your payment. Your payment has been successfully completed.", paymentSuccessHTMLTemplate)
     })

     subscribeToQueue("PAYMENT_NOTIFICATION.PAYMENT_FAILED", async (data) => {
        const paymentFailedHTMLTemplate = `
          <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Payment Failed</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: Arial, Helvetica, sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
    }
    .header {
      background-color: #dc2626;
      color: #ffffff;
      padding: 20px;
      text-align: center;
      font-size: 22px;
      font-weight: bold;
    }
    .content {
      padding: 24px;
      color: #333333;
      font-size: 14px;
      line-height: 1.6;
    }
    .details {
      margin-top: 16px;
      background: #f9fafb;
      border-radius: 6px;
      padding: 16px;
    }
    .details p {
      margin: 6px 0;
    }
    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 20px;
      background-color: #2563eb;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-size: 14px;
    }
    .footer {
      text-align: center;
      padding: 16px;
      font-size: 12px;
      color: #6b7280;
      background: #f9fafb;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      Payment Failed
    </div>

    <div class="content">
      <p>Dear <strong>{{customerName}}</strong>,</p>

      <p>
        Unfortunately, your recent payment attempt could not be completed.
        No amount has been deducted from your account.
      </p>

      <div class="details">
        <p><strong>Order ID:</strong> {{orderId}}</p>
        <p><strong>Amount:</strong> {{amount}}</p>
        <p><strong>Payment Method:</strong> {{paymentMethod}}</p>
        <p><strong>Failure Reason:</strong> {{failureReason}}</p>
        <p><strong>Date:</strong> {{paymentDate}}</p>
      </div>

      <p>
        Please retry the payment to continue using our services.
      </p>

      <a href="{{retryPaymentLink}}" class="button">Retry Payment</a>

      <p style="margin-top: 20px;">
        If you need any assistance, contact us at
        <strong>{{supportEmail}}</strong>.
      </p>

      <p>
        Sincerely,<br />
        <strong>{{companyName}} Support Team</strong>
      </p>
    </div>

    <div class="footer">
      © {{year}} {{companyName}}. All rights reserved.<br />
      This is an automated email. Please do not reply.
    </div>
  </div>
</body>
</html>

        `
       
       await sendEmail(data.email, "Payment Failed", "Unfortunately, your recent payment attempt could not be completed. No amount has been deducted from your account.", paymentFailedHTMLTemplate)
     })
}