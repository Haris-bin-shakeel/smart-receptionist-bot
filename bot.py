import os
import json
import tempfile
import requests
from textblob import TextBlob
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    ApplicationBuilder, MessageHandler, ContextTypes,
    CommandHandler, CallbackQueryHandler, filters
)
from pydub import AudioSegment
import speech_recognition as sr
from gtts import gTTS
import openai
from config import TELEGRAM_TOKEN, OPENAI_API_KEY
from calendar_helper import get_calendar_service
import datetime
import pytz
from datetime import timedelta
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import time

# Backend configuration
BACKEND_URL = os.getenv('BACKEND_URL', 'http://localhost:5000')

# Global variables for business data
business_faqs = {}
business_configs = {}
chat_business_mapping = {}

# Setup OpenAI API
openai.api_key = OPENAI_API_KEY

# In-memory user context and log store
user_contexts = {}
user_logs = []

# Speech Recognizer
recognizer = sr.Recognizer()

def load_business_data(business_id):
    """Load business-specific FAQ and configuration data"""
    global business_faqs, business_configs
    
    try:
        # Load business-specific FAQ
        faq_path = f'business_data/{business_id}/faq.json'
        if os.path.exists(faq_path):
            with open(faq_path) as f:
                business_faqs[business_id] = json.load(f)
        else:
            # Fallback to default FAQ
            with open('faq.json') as f:
                business_faqs[business_id] = json.load(f)
        
        # Load business configuration
        config_path = f'business_data/{business_id}/config.json'
        if os.path.exists(config_path):
            with open(config_path) as f:
                business_configs[business_id] = json.load(f)
        else:
            # Default configuration
            business_configs[business_id] = {
                "business_name": "Our Business",
                "greeting": "Hello! How can I help you today?",
                "business_hours": {"start": "09:00", "end": "18:00"},
                "timezone": "Asia/Karachi",
                "appointment_duration": 60,
                "services": ["General Consultation"]
            }
    except Exception as e:
        print(f"Error loading business data for {business_id}: {e}")
        # Set default values
        business_faqs[business_id] = {}
        business_configs[business_id] = {
            "business_name": "Our Business",
            "greeting": "Hello! How can I help you today?",
            "business_hours": {"start": "09:00", "end": "18:00"},
            "timezone": "Asia/Karachi"
        }

def get_business_id_from_chat(chat_id, start_param=None):
    """Get business ID from chat or start parameter"""
    # If start parameter provided, use it
    if start_param:
        chat_business_mapping[chat_id] = start_param
        return start_param
    
    # Check if chat is already mapped
    if chat_id in chat_business_mapping:
        return chat_business_mapping[chat_id]
    
    # Try to get from backend API
    try:
        response = requests.get(f"{BACKEND_URL}/api/bot/get-business-by-chat/{chat_id}")
        if response.status_code == 200:
            business_id = response.json().get('business_id')
            if business_id:
                chat_business_mapping[chat_id] = business_id
                return business_id
    except Exception as e:
        print(f"Error getting business from backend: {e}")
    
    # Default to demo business
    return 'demo'

def get_business_faq(business_id):
    """Get FAQ data for specific business"""
    if business_id not in business_faqs:
        load_business_data(business_id)
    return business_faqs.get(business_id, {})

def get_business_config(business_id):
    """Get configuration for specific business"""
    if business_id not in business_configs:
        load_business_data(business_id)
    return business_configs.get(business_id, {})

def record_interaction_to_backend(business_id, chat_id, message, response, sentiment):
    """Send interaction data to backend for analytics"""
    try:
        requests.post(f"{BACKEND_URL}/api/analytics/bot-interaction", json={
            "business_id": business_id,
            "chat_id": chat_id,
            "user_message": message,
            "bot_response": response,
            "sentiment": sentiment,
            "timestamp": datetime.datetime.now().isoformat()
        }, timeout=5)
    except Exception as e:
        print(f"Error logging to backend: {e}")

def log_user_interaction(chat_id, message, response, sentiment, business_id=None):
    user_logs.append({
        "chat_id": chat_id,
        "business_id": business_id,
        "timestamp": str(datetime.datetime.now()),
        "message": message,
        "response": response,
        "sentiment": sentiment
    })
    
    # Send to backend
    if business_id:
        record_interaction_to_backend(business_id, chat_id, message, response, sentiment)
    
    # Write logs to file after every 5 interactions
    if len(user_logs) % 5 == 0:
        with open("logs.json", "w") as log_file:
            json.dump(user_logs, log_file, indent=2)

def smart_faq_match(user_query, business_id):
    """Smart FAQ matching for specific business"""
    faq_data = get_business_faq(business_id)
    
    if not faq_data:
        return None
    
    try:
        faq_questions = list(faq_data.keys())
        if not faq_questions:
            return None
            
        vectorizer = TfidfVectorizer().fit(faq_questions)
        faq_vectors = vectorizer.transform(faq_questions)
        query_vec = vectorizer.transform([user_query])
        similarities = cosine_similarity(query_vec, faq_vectors)
        max_index = similarities.argmax()
        max_score = similarities[0, max_index]
        
        if max_score > 0.6:
            return faq_data[faq_questions[max_index]]
    except Exception as e:
        print(f"Error in FAQ matching: {e}")
    
    return None

def detect_sentiment(message):
    analysis = TextBlob(message)
    # Use analysis.sentiment.polarity directly (TextBlob returns a Sentiment object)
    try:
        polarity = analysis.sentiment.polarity
    except Exception:
        polarity = 0
    if polarity < -0.3:
        return "angry"
    elif polarity > 0.3:
        return "positive"
    else:
        return "neutral"

def get_user_history(chat_id):
    return user_contexts.get(chat_id, [])

def is_business_hours(business_id):
    """Check if current time is within business hours"""
    try:
        config = get_business_config(business_id)
        tz = pytz.timezone(config.get('timezone', 'Asia/Karachi'))
        now = datetime.datetime.now(tz)
        
        start_hour = int(config.get('business_hours', {}).get('start', '09:00').split(':')[0])
        end_hour = int(config.get('business_hours', {}).get('end', '18:00').split(':')[0])
        
        return start_hour <= now.hour < end_hour
    except:
        return True  # Default to always open

def is_premium_user(business_id):
    """Check if business has premium subscription"""
    try:
        response = requests.get(f"{BACKEND_URL}/api/subscriptions/check-status/{business_id}", timeout=5)
        if response.status_code == 200:
            plan = response.json().get('plan', 'free')
            return plan in ['business', 'premium']
    except Exception as e:
        print(f"Error checking subscription: {e}")
    return False  # Default to free

async def process_user_message(user_msg, chat_id, update, context, business_id):
    history = get_user_history(chat_id)
    print(f"Processing message for business {business_id}: {user_msg}")

    # Append the current user message to the chat history and store the last 5 messages
    history.append(user_msg)
    user_contexts[chat_id] = history[-5:]

    # Get business configuration
    config = get_business_config(business_id)

    # Check if the message contains appointment or calendar-related requests
    if "appointment" in user_msg or "schedule" in user_msg or "book" in user_msg:
        try:
            if not is_business_hours(business_id):
                await update.message.reply_text(
                    f"🕐 We're currently outside business hours. "
                    f"Our hours are {config.get('business_hours', {}).get('start', '9:00')} - "
                    f"{config.get('business_hours', {}).get('end', '18:00')}. "
                    f"Would you still like to schedule an appointment?"
                )
            
            services = config.get('services', ['General Consultation'])
            service_buttons = [
                [InlineKeyboardButton(service, callback_data=f'service_{i}_{business_id}')]
                for i, service in enumerate(services[:3])  # Limit to 3 services
            ]
            service_buttons.append([InlineKeyboardButton("Cancel", callback_data=f'schedule_no_{business_id}')])
            
            reply_markup = InlineKeyboardMarkup(service_buttons)
            await update.message.reply_text(
                f"📅 I'd be happy to help you book an appointment with {config.get('business_name', 'us')}!\n"
                f"Please select the service you need:",
                reply_markup=reply_markup
            )
        except Exception as e:
            print(f"Error in appointment prompt: {e}")
            await update.message.reply_text("Sorry, I couldn't process your appointment request.")
        return

    # Check if the message contains calendar-related queries
    if "calendar" in user_msg or "events" in user_msg:
        try:
            service = get_calendar_service()
            try:
                events_result = service.events().list(
                    calendarId='primary',
                    timeMin=datetime.datetime.now(pytz.UTC).isoformat(),
                    maxResults=10,
                    singleEvents=True,
                    orderBy='startTime'
                ).execute()

                events = events_result.get('items', [])
                if not events:
                    await update.message.reply_text("No upcoming events found.")
                else:
                    event_list = [
                        f"📅 {event['summary']} ({event['start'].get('dateTime', event['start'].get('date'))})"
                        for event in events
                    ]
                    await update.message.reply_text("\n".join(event_list))
            except Exception as e:
                print(f"Error fetching calendar events: {e}")
                await update.message.reply_text(f"❌ Error fetching calendar events. Please try again later.")
        except Exception as e:
            print(f"Error initializing calendar service: {e}")
            await update.message.reply_text("Sorry, I couldn't access your calendar.")
        return

    # Detect sentiment in user input
    try:
        sentiment = detect_sentiment(user_msg)
        print(f"Detected sentiment: {sentiment}")
    except Exception as e:
        print(f"Error detecting sentiment: {e}")
        sentiment = "neutral"

    # Try to match the query to business-specific FAQs
    try:
        answer = smart_faq_match(user_msg, business_id)
    except Exception as e:
        print(f"Error in FAQ matching: {e}")
        answer = None
    
    if answer:
        try:
            await update.message.reply_text(answer)
            log_user_interaction(chat_id, user_msg, answer, sentiment, business_id)
        except Exception as e:
            print(f"Error replying to FAQ: {e}")
            await update.message.reply_text("Sorry, I couldn't answer your question.")
    else:
        # Use AI-based fallback logic if no FAQ match is found
        try:
            ai_reply = await handle_ai_fallback(user_msg, business_id)
            await update.message.reply_text(ai_reply)
            log_user_interaction(chat_id, user_msg, ai_reply, sentiment, business_id)
        except Exception as e:
            print(f"Error in AI fallback: {e}")
            await update.message.reply_text("Sorry, I couldn't process your request.")

async def handle_ai_fallback(user_input, business_id):
    # Check if business has premium subscription
    if not is_premium_user(business_id):
        config = get_business_config(business_id)
        business_name = config.get('business_name', 'this business')
        return (
            f"🤖 Advanced AI responses are available in our premium plans.\n"
            f"Contact {business_name} to upgrade for unlimited smart AI replies!"
        )
    
    # Try FAQ match first
    answer = smart_faq_match(user_input, business_id)
    if answer:
        return answer
    
    # Use OpenAI for premium users
    try:
        if hasattr(openai, 'ChatCompletion'):
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": f"You are a helpful receptionist for {get_business_config(business_id).get('business_name', 'a business')}. Be professional and helpful."},
                    {"role": "user", "content": user_input}
                ],
                max_tokens=150
            )
            return response['choices'][0]['message']['content']
        elif hasattr(openai, 'Completion'):
            response = openai.Completion.create(
                engine="text-davinci-003",
                prompt=f"As a professional receptionist, respond to: {user_input}",
                max_tokens=150
            )
            return response.choices[0].text.strip()
    except Exception as e:
        print(f"OpenAI API error: {e}")
    
    return "I understand your question, but I need more specific information to help you properly. Could you please rephrase or contact us directly?"

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if update.message:
        chat_id = update.effective_chat.id
        
        # Get business ID from start parameter
        business_id = 'demo'  # default
        if context.args and len(context.args) > 0:
            business_id = context.args[0]
            chat_business_mapping[chat_id] = business_id
        
        # Load business data
        load_business_data(business_id)
        config = get_business_config(business_id)
        
        # Send personalized greeting
        greeting = config.get('greeting', 'Hello! Your AI Receptionist is ready to assist you.')
        business_name = config.get('business_name', 'Our Business')
        
        welcome_message = f"👋 Welcome to {business_name}!\n\n{greeting}\n\n"
        
        if is_business_hours(business_id):
            welcome_message += "🟢 We're currently online and ready to help!"
        else:
            hours = config.get('business_hours', {})
            welcome_message += f"🕐 We're currently offline. Our business hours are {hours.get('start', '9:00')} - {hours.get('end', '18:00')}."
        
        await update.message.reply_text(welcome_message)

async def handle_text_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if update.message and update.message.text:
        user_msg = update.message.text.lower()
        chat_id = update.effective_chat.id if update.effective_chat else None
        if chat_id is not None:
            business_id = get_business_id_from_chat(chat_id)
            await process_user_message(user_msg, chat_id, update, context, business_id)

async def handle_callback_query(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    if query:
        try:
            await query.answer()
        except Exception as e:
            print(f"Error answering callback query: {e}")
        
        if hasattr(query, 'data'):
            data_parts = query.data.split('_')
            
            # Handle service selection
            if data_parts[0] == 'service' and len(data_parts) >= 3:
                service_index = int(data_parts[1])
                business_id = data_parts[2]
                config = get_business_config(business_id)
                services = config.get('services', ['General Consultation'])
                
                if service_index < len(services):
                    selected_service = services[service_index]
                    
                    # Create calendar event
                    try:
                        service = get_calendar_service()
                        tz = pytz.timezone(config.get('timezone', 'Asia/Karachi'))
                        start_time = tz.localize(datetime.datetime.now() + timedelta(days=1)).replace(hour=15, minute=0, second=0)
                        end_time = start_time + timedelta(minutes=config.get('appointment_duration', 60))
                        
                        event = {
                            'summary': f'{selected_service} - {config.get("business_name", "Business")}',
                            'location': config.get('address', 'Online'),
                            'description': f'Appointment for {selected_service}',
                            'start': {'dateTime': start_time.isoformat(), 'timeZone': config.get('timezone', 'Asia/Karachi')},
                            'end': {'dateTime': end_time.isoformat(), 'timeZone': config.get('timezone', 'Asia/Karachi')},
                            'reminders': {
                                'useDefault': False,
                                'overrides': [
                                    {'method': 'email', 'minutes': 24 * 60},
                                    {'method': 'popup', 'minutes': 10}
                                ]
                            },
                        }
                        
                        event_result = service.events().insert(calendarId='primary', body=event).execute()
                        
                        if hasattr(query, 'edit_message_text'):
                            await query.edit_message_text(
                                f"✅ Your {selected_service} appointment has been booked!\n"
                                f"📅 Date: {start_time.strftime('%B %d, %Y at %I:%M %p')}\n"
                                f"⏰ Duration: {config.get('appointment_duration', 60)} minutes\n\n"
                                f"You'll receive a confirmation email shortly.",
                                parse_mode="Markdown"
                            )
                    except Exception as e:
                        print(f"Error creating calendar event: {e}")
                        if hasattr(query, 'edit_message_text'):
                            await query.edit_message_text("❌ Sorry, there was an error booking your appointment. Please try again or contact us directly.")
            
            # Handle appointment cancellation
            elif query.data.startswith('schedule_no'):
                try:
                    if hasattr(query, 'edit_message_text'):
                        await query.edit_message_text("No problem! Feel free to ask if you need anything else. 😊")
                except Exception as e:
                    print(f"Error editing message for schedule_no: {e}")

async def handle_voice_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        if update.message and update.message.voice:
            chat_id = update.effective_chat.id
            business_id = get_business_id_from_chat(chat_id)
            
            try:
                voice_file = await update.message.voice.get_file()
                voice_file_path = "user_voice.ogg"
                await voice_file.download_to_drive(voice_file_path)
                audio = AudioSegment.from_ogg(voice_file_path)
                wav_file_path = "user_voice.wav"
                audio.export(wav_file_path, format="wav")
                with sr.AudioFile(wav_file_path) as source:
                    audio_data = recognizer.record(source)
                    user_text = None
                    if hasattr(recognizer, 'recognize_google'):
                        try:
                            user_text = recognizer.recognize_google(audio_data)
                        except Exception:
                            user_text = None
                    if user_text:
                        print(f"User said: {user_text}")
                        user_text = user_text.lower()
                        if chat_id is not None:
                            await process_user_message(user_text, chat_id, update, context, business_id)
                    else:
                        if update.message:
                            await update.message.reply_text("Sorry, I couldn't understand the audio.")
                os.remove(wav_file_path)
            except Exception as e:
                print(f"Error processing voice file: {e}")
                if update.message:
                    await update.message.reply_text("Sorry, I couldn't process the audio file.")
    except Exception as e:
        print(f"Error processing voice message: {e}")
        if update.message:
            await update.message.reply_text("Sorry, I couldn't process the audio.")

async def reset_context(update: Update, context: ContextTypes.DEFAULT_TYPE):
    chat_id = update.effective_chat.id if update.effective_chat else None
    if chat_id is not None:
        user_contexts[chat_id] = []
        try:
            if update.message:
                await update.message.reply_text("🧹 Context has been cleared.")
        except Exception as e:
            print(f"Error resetting context: {e}")

# Setup Bot
app = ApplicationBuilder().token(TELEGRAM_TOKEN).build()

print("Starting multi-business AI receptionist bot...")

if TELEGRAM_TOKEN is None:
    print("ERROR: TELEGRAM_TOKEN is not set. Please check your environment variables.")
    import sys
    sys.exit(1)

app.add_handler(CommandHandler("start", start))
app.add_handler(CommandHandler("reset", reset_context))
app.add_handler(CallbackQueryHandler(handle_callback_query))
app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text_message))
app.add_handler(MessageHandler(filters.VOICE, handle_voice_message))

print("Multi-business bot running with smart FAQ, GPT fallback, premium notifications, and logging...")
app.run_polling() 