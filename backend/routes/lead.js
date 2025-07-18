const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configure nodemailer for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASS  // your Gmail app password
  }
});

router.post('/', async (req, res) => {
  console.log('Received POST /api/lead', req.body); // Log incoming request
  let { name, email, company, website, industry, budget, contact, message } = req.body;
  // Only require email, fill others with '-'
  if (!email) {
    console.log('Missing required field: email');
    return res.status(400).json({ error: 'Email is required.' });
  }
  name = name || '-';
  company = company || '-';
  website = website || '-';
  industry = industry || '-';
  budget = budget || '-';
  contact = contact || '-';
  message = message || '-';
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'harisshakeel0981@gmail.com',
    subject: 'New Business Integration Lead',
    text: `New lead received:\n\nName: ${name}\nEmail: ${email}\nCompany: ${company}\nWebsite: ${website}\nIndustry: ${industry}\nBudget: ${budget}\nPreferred Contact: ${contact}\nMessage: ${message}`
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to harisshakeel0981@gmail.com');
    res.json({ success: true });
  } catch (err) {
    console.error('Error sending lead email:', err);
    res.status(500).json({ error: 'Failed to send email.', details: err.message });
  }
});

module.exports = router; 