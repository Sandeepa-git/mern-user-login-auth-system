import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.SEND_GRID_API) {
  console.warn('Warning: SEND_GRID_API is not defined in .env');
}
if (!process.env.FROM_EMAIL) {
  console.warn('Warning: FROM_EMAIL is not defined in .env');
}

sgMail.setApiKey(process.env.SEND_GRID_API);

const fromEmail = process.env.FROM_EMAIL;

export const sendEmail = async (to, subject, html) => {
  if (!to || !subject || !html) {
    console.error('Missing email parameters');
    return false;
  }

  const msg = {
    to,
    from: fromEmail, // ✅ No display name — SendGrid will reject otherwise
    subject,
    html,
    text: html.replace(/<[^>]*>/g, ''),
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');
    return true;
  } catch (error) {
    if (error.response) {
      console.error('SendGrid response error:', error.response.body);
    } else {
      console.error('Error sending email:', error.message);
    }
    return false;
  }
};
