import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Telegram Bot Token
TELEGRAM_TOKEN = os.getenv('TELEGRAM_TOKEN', 'your-telegram-bot-token-here')

# OpenAI API Key
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', 'your-openai-api-key-here')

# You can set these values directly or use environment variables:
# TELEGRAM_TOKEN = "your-actual-telegram-token"
# OPENAI_API_KEY = "your-actual-openai-key"