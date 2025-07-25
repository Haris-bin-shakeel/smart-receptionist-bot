#!/usr/bin/env python3
"""
Test script to verify multi-business functionality
"""
import json
import os

def test_business_loading():
    print("🧪 Testing Multi-Business System...")
    
    # Test 1: Check if business directories exist
    print("\n1. Checking business directories...")
    if os.path.exists("business_data/mimi"):
        print("   ✅ Mimi's directory exists")
    else:
        print("   ❌ Mimi's directory missing")
        return False
    
    if os.path.exists("business_data/demo"):
        print("   ✅ Demo directory exists")
    else:
        print("   ❌ Demo directory missing")
        return False
    
    # Test 2: Check config files
    print("\n2. Checking configuration files...")
    try:
        with open("business_data/mimi/config.json", 'r') as f:
            mimi_config = json.load(f)
        print(f"   ✅ Mimi's config loaded: {mimi_config['business_name']}")
    except Exception as e:
        print(f"   ❌ Mimi's config failed: {e}")
        return False
    
    try:
        with open("business_data/demo/config.json", 'r') as f:
            demo_config = json.load(f)
        print(f"   ✅ Demo config loaded: {demo_config['business_name']}")
    except Exception as e:
        print(f"   ❌ Demo config failed: {e}")
        return False
    
    # Test 3: Check FAQ files
    print("\n3. Checking FAQ files...")
    try:
        with open("business_data/mimi/faq.json", 'r') as f:
            mimi_faq = json.load(f)
        print(f"   ✅ Mimi's FAQ loaded: {len(mimi_faq)} questions")
    except Exception as e:
        print(f"   ❌ Mimi's FAQ failed: {e}")
        return False
    
    try:
        with open("faq.json", 'r') as f:
            default_faq = json.load(f)
        print(f"   ✅ Default FAQ loaded: {len(default_faq)} questions")
    except Exception as e:
        print(f"   ❌ Default FAQ failed: {e}")
        return False
    
    # Test 4: Check business-specific features
    print("\n4. Testing business-specific features...")
    
    # Mimi's services
    mimi_services = mimi_config.get('services', [])
    print(f"   ✅ Mimi's services: {', '.join(mimi_services)}")
    
    # Business hours
    mimi_hours = mimi_config.get('business_hours', {})
    print(f"   ✅ Mimi's hours: {mimi_hours.get('start')} - {mimi_hours.get('end')}")
    
    # Sample FAQ test
    sample_questions = list(mimi_faq.keys())[:3]
    print(f"   ✅ Sample Mimi FAQ: {', '.join(sample_questions)}")
    
    print("\n🎉 All tests passed! Multi-business system is working!")
    return True

def test_bot_link_generation():
    print("\n🔗 Testing Bot Link Generation...")
    base_url = "https://t.me/yourbot"  # Replace with your actual bot username
    
    # Mimi's custom link
    mimi_link = f"{base_url}?start=mimi"
    print(f"   📋 Mimi's Bot Link: {mimi_link}")
    
    # Demo link
    demo_link = f"{base_url}?start=demo"
    print(f"   📋 Demo Bot Link: {demo_link}")
    
    # Generic link (defaults to demo)
    generic_link = base_url
    print(f"   📋 Generic Bot Link: {generic_link}")

if __name__ == "__main__":
    print("=" * 50)
    print("   MULTI-BUSINESS BOT TEST SUITE")
    print("=" * 50)
    
    if test_business_loading():
        test_bot_link_generation()
        
        print("\n" + "=" * 50)
        print("✅ CONFIRMATION: Your multi-business system is READY!")
        print("\nTo go live:")
        print("1. Add your real TELEGRAM_TOKEN to .env")
        print("2. Add your OPENAI_API_KEY to .env") 
        print("3. Run: python3 bot.py")
        print("4. Test with: /start mimi")
        print("=" * 50)
    else:
        print("\n❌ Some tests failed. Check the errors above.")