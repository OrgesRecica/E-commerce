import Message from '../models/Message.js';
import { sendEmail } from '../services/email.service.js';

export async function createMessage(req, res, next) {
  try {
    const { name, email, company = '', phone = '', subject = 'general', message } = req.body;
    const saved = await Message.create({ name, email, company, phone, subject, message });
    if (process.env.SMTP_HOST) {
      const body = [
        `From: ${name} <${email}>`,
        company ? `Company: ${company}` : null,
        phone ? `Phone: ${phone}` : null,
        `Subject: ${subject}`,
        '',
        message,
      ].filter(Boolean).join('\n');
      sendEmail({
        to: process.env.SMTP_FROM,
        subject: `[SCAMPA · ${subject}] New contact from ${name}`,
        text: body,
      }).catch((e) => console.warn('email failed:', e.message));
    }
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
}
