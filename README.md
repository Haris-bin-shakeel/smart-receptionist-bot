# 🤖 AI Receptionist Bot

Your **24/7 Smart Virtual Assistant** for modern businesses — built on Telegram, powered by AI.

[🔗 Try the Demo](https://t.me/ourreceptionistbot)  
[🌐 Visit Live Website](https://smart-receptionist.netlify.app)

---

## 🚀 Project Overview

The AI Receptionist is a cloud-deployed smart Telegram bot that automates receptionist tasks such as:

- Answering customer FAQs using fuzzy matching
- Booking appointments via Google Calendar
- Detecting emotion/sentiment
- Handling voice messages
- Smart fallback replies via OpenAI (GPT)

---

## ✨ Features

- ✅ FAQ Matching using Fuzzy Search
- ✅ Voice & Text Support (via SpeechRecognition & ffmpeg)
- ✅ Sentiment Detection using TextBlob
- ✅ Google Calendar Booking & Event View
- ✅ AI Fallback (OpenAI 3.5 Turbo)
- ✅ Admin Dashboard-Ready Logging
- ✅ Modular Codebase with Unit Tests
- ✅ Modern, responsive React-based Landing Page
- ✅ Sticky Navbar with smooth scroll navigation
- ✅ Real Feedback form (email-based)
- ✅ Mobile-first, dark/gradient theme

---

## 💰 Plans & Pricing

| Plan       | Price         | Features Included |
|------------|---------------|-------------------|
| Free       | $0 / month    | Demo access, limited voice/FAQ, no AI |
| Business   | Custom Quote  | Branding, multi-agent, admin panel, analytics |

---

## 🛠️ Tech Stack

- **Frontend**: React, CSS (custom design system), Font Awesome, Pacifico font, Netlify
- **Backend**: Python, `python-telegram-bot`, Flask
- **APIs**: OpenAI API, Google Calendar API
- **Voice**: `pydub`, `SpeechRecognition`, `ffmpeg`
- **Deployment**: Heroku (bot), Netlify (website)

---

## 📂 Project Structure

ai-receptionist-website/
│
├── public/ # Assets
│ ├── qr-telegram.png
│ └── demo.gif
│
├── src/
│ ├── components/ # All modular UI components
│ │   ├── Hero.jsx
│ │   ├── Features.jsx
│ │   ├── Benefits.jsx
│ │   ├── Pricing.jsx
│ │   ├── Testimonials.jsx
│ │   ├── FeedbackForm.jsx
│ │   ├── Navbar.jsx
│ │   ├── StickyCTA.jsx
│ │   ├── Loader.jsx
│ │   └── Footer.jsx
│ ├── App.jsx
│ └── App.css
│
├── bot/ # Python bot logic (separate repo)
├── .env # API keys
├── README.md
└── package.json

---

## 📦 Deployment

- 🔧 Website hosted on: [Netlify](https://smart-receptionist.netlify.app)
- 🤖 Telegram Bot: [@ourreceptionistbot](https://t.me/ourreceptionistbot)

### Deploying Updates

1. **Push your code to GitHub** (main branch).
2. **Netlify auto-builds and deploys** your site on every push.
3. **Build command:** `npm run build`  
   **Publish directory:** `build`
4. **Build image:** Ubuntu Focal 20.04 (set in Netlify site settings)

*Do NOT upload the build folder manually. Use GitHub → Netlify integration for CI/CD.*

---

## 📬 Contact

- 📧 Email: [harisshakeel0981@gmail.com](mailto:harisshakeel0981@gmail.com)
- 🌐 LinkedIn: [haris-shakeel-aa1186330](https://www.linkedin.com/in/haris-shakeel-aa1186330)
- 📱 WhatsApp: [+92-344-8375098](https://wa.me/923448375098)

---

## 🏁 Status

**Live, working, and ready for client demos and integrations.**  
Want to integrate this bot into your business? [Contact Me](mailto:harisshakeel0981@gmail.com)

---

## 📈 Future Plans

- 🔐 Admin Dashboard
- 🔁 Multi-agent logic
- 📊 Analytics and Usage reports
- 🌐 Multilingual Support
- 💬 WhatsApp & Web Chat integration

---

> Made with ❤️ by Muhammad Haris  
> Powered by OpenAI + Telegram API

