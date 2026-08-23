# Smart Receptionist Bot

![Python](https://img.shields.io/badge/Python-3670A0?style=flat-square&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT-41281D?style=flat-square&logo=openai&logoColor=white)

**A Telegram AI receptionist for small businesses: instant FAQ answers from the business's own knowledge, appointment booking straight into Google Calendar, voice-message handling, sentiment detection, and an LLM fallback for anything the knowledge base doesn't cover — with a React landing page on top.**

[Try the demo bot](https://t.me/ourreceptionistbot) · [Live landing page](https://smart-receptionist.netlify.app)

## Why this exists

Small businesses miss calls and repeat the same answers all day. This bot gives them a 24/7 front desk with three tiers of response — exact FAQ match (fuzzy search over the business's Q&A), structured actions (real Calendar booking), and a GPT fallback that stays inside the business's tone and facts. Escalation is honest: when confidence is low, it says so and takes a message.

## What it does

- **FAQ matching** — fuzzy search over the business knowledge base; no LLM call needed for known questions
- **Appointment booking** — creates and lists Google Calendar events from chat
- **Voice messages** — Telegram voice → text (SpeechRecognition + ffmpeg), then handled like text
- **Sentiment detection** — TextBlob polarity flags frustrated users for priority handling
- **LLM fallback** — GPT-3.5 answers only when FAQ confidence is low
- **Admin logging** — conversation logs ready for a dashboard
- **Landing page** — React site with features, pricing, testimonials, feedback form

## Architecture

```text
Telegram ──▶ python-telegram-bot handler chain
                ├─ FAQ fuzzy matcher ──────────▶ answer (no LLM)
                ├─ Calendar intent ────────────▶ Google Calendar API
                ├─ Voice ──▶ SpeechRecognition ─▶ text pipeline
                ├─ Sentiment (TextBlob) ───────▶ flag / prioritize
                └─ Fallback ──▶ OpenAI GPT-3.5 ─▶ guarded answer
React landing page (src/components) ──▶ Netlify
Backend ──▶ Flask (Heroku) · Firebase setup + Stripe integration documented in-repo
```

## Run

```bash
# Backend
cd backend && pip install -r requirements.txt
export TELEGRAM_TOKEN=… OPENAI_API_KEY=… GOOGLE_CREDENTIALS=…
python bot.py

# Landing page
npm install && npm start
```

See `FIREBASE_SETUP.md` and `STRIPE_INTEGRATION.md` for those integrations.

## Tech stack

Python · python-telegram-bot · Flask · OpenAI GPT-3.5 · Google Calendar API · SpeechRecognition + pydub/ffmpeg · TextBlob · React · Firebase · Stripe · Netlify/Heroku
