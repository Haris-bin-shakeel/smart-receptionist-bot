#!/usr/bin/env python3
"""
Business Setup Script for AI Receptionist Bot
Creates business-specific configurations and generates custom bot links
"""

import json
import os
import sys
from urllib.parse import quote

def create_business_directory(business_id):
    """Create directory structure for a new business"""
    business_dir = f"business_data/{business_id}"
    os.makedirs(business_dir, exist_ok=True)
    return business_dir

def create_business_config(business_data, business_dir):
    """Create business configuration file"""
    config_path = f"{business_dir}/config.json"
    
    config = {
        "business_name": business_data["name"],
        "business_type": business_data.get("type", "General Business"),
        "greeting": business_data.get("greeting", f"Hello! Welcome to {business_data['name']}! How can I help you today?"),
        "business_hours": business_data.get("hours", {"start": "09:00", "end": "18:00"}),
        "timezone": business_data.get("timezone", "Asia/Karachi"),
        "appointment_duration": business_data.get("duration", 60),
        "services": business_data.get("services", ["General Consultation"]),
        "address": business_data.get("address", ""),
        "phone": business_data.get("phone", ""),
        "email": business_data.get("email", ""),
        "social_media": business_data.get("social", {}),
        "payment_methods": business_data.get("payments", ["Cash", "Card"]),
        "special_notes": business_data.get("notes", "")
    }
    
    with open(config_path, 'w') as f:
        json.dump(config, f, indent=2)
    
    print(f"✅ Created business config: {config_path}")
    return config

def create_business_faq(faq_data, business_dir):
    """Create business FAQ file"""
    faq_path = f"{business_dir}/faq.json"
    
    # Default FAQ template
    default_faq = {
        "what services do you offer": f"We offer various services. Would you like to know more about any specific service?",
        "what are your hours": "Please check our business hours. Would you like to schedule an appointment?",
        "where are you located": "We're conveniently located. Would you like directions?",
        "how to book appointment": "I can help you book an appointment right now! Just let me know your preferred service and time.",
        "what are your prices": "Our pricing varies by service. Would you like a quote for a specific service?"
    }
    
    # Merge with provided FAQ data
    if faq_data:
        default_faq.update(faq_data)
    
    with open(faq_path, 'w') as f:
        json.dump(default_faq, f, indent=2)
    
    print(f"✅ Created business FAQ: {faq_path}")
    return default_faq

def generate_bot_links(business_id, bot_username="yourbot"):
    """Generate custom bot links for the business"""
    base_link = f"https://t.me/{bot_username}?start={business_id}"
    qr_data = base_link
    
    return {
        "telegram_link": base_link,
        "qr_code_data": qr_data,
        "share_text": f"Chat with our AI assistant: {base_link}"
    }

def setup_mimi_business():
    """Set up Mimi's Beauty Studio business"""
    business_data = {
        "name": "Mimi's Beauty Studio",
        "type": "Beauty Salon",
        "greeting": "Hi there! 💄 Welcome to Mimi's Beauty Studio! I'm here to help you with appointments, services, and answer any questions about our beauty treatments.",
        "hours": {"start": "10:00", "end": "19:00"},
        "duration": 90,
        "services": [
            "Hair Styling & Cut",
            "Facial Treatment", 
            "Manicure & Pedicure",
            "Bridal Makeup",
            "Hair Coloring"
        ],
        "address": "Beauty Plaza, Main Market Street",
        "phone": "+92-XXX-XXXXXXX",
        "email": "appointments@mimisbeauty.com",
        "social": {
            "instagram": "@mimisbeautystudio",
            "facebook": "Mimi's Beauty Studio"
        },
        "payments": ["Cash", "Card", "Bank Transfer"],
        "notes": "Please arrive 10 minutes early. Complimentary refreshments provided."
    }
    
    faq_data = {
        "what services do you offer": "We offer:\n💇‍♀️ Hair Styling & Cutting\n✨ Facial Treatments\n💅 Manicure & Pedicure\n👰 Bridal Makeup\n🎨 Hair Coloring\n\nWould you like to book an appointment?",
        "what are your prices": "Our pricing:\n💇‍♀️ Hair Cut: PKR 1,500-3,000\n✨ Facial: PKR 2,500-5,000\n💅 Manicure: PKR 1,200\n💅 Pedicure: PKR 1,500\n👰 Bridal: PKR 15,000-25,000\n🎨 Hair Color: PKR 3,000-8,000\n\nPrices vary by requirements. Want a consultation?",
        "what are your hours": "We're open:\n🕐 Monday-Saturday: 10:00 AM - 7:00 PM\n🕐 Sunday: Closed\n\nWould you like to schedule an appointment?",
        "where are you located": "📍 Beauty Plaza, Main Market Street\n\nFree parking available! Need directions?",
        "do you offer bridal packages": "Yes! 👰✨ Our bridal packages include:\n• Trial makeup\n• Wedding day styling\n• Hair & makeup\n• Touch-up kit\n• Skincare consultation\n\nPackages: PKR 15,000-25,000. Interested?"
    }
    
    return setup_business("mimi", business_data, faq_data)

def setup_business(business_id, business_data, faq_data=None):
    """Set up a complete business configuration"""
    print(f"\n🚀 Setting up business: {business_data['name']}")
    print(f"📝 Business ID: {business_id}")
    
    # Create directory
    business_dir = create_business_directory(business_id)
    
    # Create config
    config = create_business_config(business_data, business_dir)
    
    # Create FAQ
    faq = create_business_faq(faq_data, business_dir)
    
    # Generate bot links
    links = generate_bot_links(business_id, "ourreceptionistbot")  # Your actual bot username
    
    print(f"\n📱 Bot Integration Ready!")
    print(f"🔗 Custom Bot Link: {links['telegram_link']}")
    print(f"📱 Share with customers: {links['share_text']}")
    
    print(f"\n✅ Business setup complete for {business_data['name']}!")
    print(f"📂 Files created in: {business_dir}/")
    
    return {
        "business_id": business_id,
        "config": config,
        "faq": faq,
        "links": links
    }

def main():
    """Main setup function"""
    print("🤖 AI Receptionist Business Setup")
    print("=" * 40)
    
    if len(sys.argv) > 1 and sys.argv[1] == "mimi":
        # Set up Mimi's business
        result = setup_mimi_business()
        
        print(f"\n🎉 Mimi's Beauty Studio is ready!")
        print(f"📞 Give this link to Mimi's customers:")
        print(f"   {result['links']['telegram_link']}")
        print(f"\n📋 Next steps:")
        print(f"   1. Share the custom link with Mimi")
        print(f"   2. Her customers will get personalized service")
        print(f"   3. All interactions will be tracked for analytics")
        
    else:
        print("Usage: python setup_business.py mimi")
        print("       python setup_business.py [business_id]")

if __name__ == "__main__":
    main()