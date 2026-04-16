import Message from '../models/Message.js';
import { sendEmail } from '../services/email.service.js';

export async function createMessage(req, res, next) {
  try {
    const { name, email, message } = req.body;
    const saved = await Message.create({ name, email, message });
    if (process.env.SMTP_HOST) {
      sendEmail({
        to: process.env.SMTP_FROM,
        subject: `New contact from ${name}`,
        text: `${email}\n\n${message}`,
      }).catch((e) => console.warn('email failed:', e.message));
    }
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
}
