import { sendEmail } from './email.service.js';

export async function sendVerificationEmail(user, token) {
  if (!process.env.SMTP_HOST) return false;

  const apiUrl = (process.env.PUBLIC_API_URL || process.env.API_URL || 'http://localhost:5000').replace(/\/$/, '');
  const verifyUrl = `${apiUrl}/api/auth/verify-email/${token}`;

  await sendEmail({
    to: user.email,
    subject: 'Verify your SCAMPA account',
    text: [
      `Hello ${user.name},`,
      '',
      'Verify your email address to finish securing your SCAMPA account:',
      verifyUrl,
      '',
      'This link expires in 24 hours. If you did not create this account, ignore this email.',
    ].join('\n'),
  });

  return true;
}
