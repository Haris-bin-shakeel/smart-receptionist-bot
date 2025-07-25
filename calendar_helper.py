import os
import pickle
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/calendar']

def get_calendar_service():
    """Get Google Calendar service object"""
    creds = None
    
    # The file token.pickle stores the user's access and refresh tokens.
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            try:
                creds.refresh(Request())
            except:
                # If refresh fails, we'll need to re-authenticate
                creds = None
        
        if not creds:
            # For demo purposes, return None if no credentials
            # In production, you'd want to handle authentication properly
            print("No valid Google Calendar credentials found.")
            print("Calendar integration disabled for this session.")
            return None
    
    try:
        service = build('calendar', 'v3', credentials=creds)
        return service
    except Exception as e:
        print(f"Error building calendar service: {e}")
        return None

def save_credentials(creds):
    """Save credentials to token.pickle"""
    with open('token.pickle', 'wb') as token:
        pickle.dump(creds, token)

# For testing without Google Calendar setup
def mock_calendar_service():
    """Mock calendar service for testing"""
    class MockCalendarService:
        def events(self):
            return MockEvents()
    
    class MockEvents:
        def list(self, **kwargs):
            return MockExecute()
        
        def insert(self, **kwargs):
            return MockExecute()
    
    class MockExecute:
        def execute(self):
            return {
                'items': [],
                'htmlLink': 'https://calendar.google.com/calendar/event?eid=mock'
            }
    
    return MockCalendarService()

# Use this if you don't have Google Calendar set up yet
def get_calendar_service_or_mock():
    """Get calendar service or return mock for testing"""
    try:
        service = get_calendar_service()
        if service is None:
            print("Using mock calendar service for testing...")
            return mock_calendar_service()
        return service
    except Exception as e:
        print(f"Calendar service error: {e}")
        print("Using mock calendar service...")
        return mock_calendar_service()