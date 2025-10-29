#!/usr/bin/env python3
"""
Upload video to YouTube using API
"""
import os
import pickle
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

# Scopes required for YouTube upload
SCOPES = ['https://www.googleapis.com/auth/youtube.upload']

def get_authenticated_service():
    """Authenticate and return YouTube service"""
    creds = None
    token_file = 'token.pickle'

    # Check if we have saved credentials
    if os.path.exists(token_file):
        with open(token_file, 'rb') as token:
            creds = pickle.load(token)

    # If no valid credentials, authenticate
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)

        # Save credentials for next time
        with open(token_file, 'wb') as token:
            pickle.dump(creds, token)

    return build('youtube', 'v3', credentials=creds)

def upload_video(youtube, video_file, title, description, privacy_status='unlisted'):
    """Upload video to YouTube"""

    body = {
        'snippet': {
            'title': title,
            'description': description,
            'categoryId': '22'  # People & Blogs
        },
        'status': {
            'privacyStatus': privacy_status,
            'selfDeclaredMadeForKids': False
        }
    }

    # Create media upload
    media = MediaFileUpload(video_file, chunksize=-1, resumable=True)

    # Execute upload
    print(f"📤 Uploading {video_file}...")
    request = youtube.videos().insert(
        part=','.join(body.keys()),
        body=body,
        media_body=media
    )

    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            print(f"⏳ Upload {int(status.progress() * 100)}% complete")

    print(f"✅ Upload complete!")
    print(f"🎬 Video ID: {response['id']}")
    print(f"🔗 URL: https://www.youtube.com/watch?v={response['id']}")

    return response

if __name__ == '__main__':
    # Video details
    VIDEO_FILE = '/mnt/d/Film Projects/Golden Wings/screening_promo/GE50YFP_720p_web.mp4'
    TITLE = 'Golden Wings - A 50-Year Journey Through Aviation History'
    DESCRIPTION = '''Golden Wings chronicles the remarkable career of Robyn Stewart, an American Airlines flight attendant whose 50+ years in the skies witnessed the transformation of commercial aviation.

Through intimate interviews and archival footage, this documentary captures stories of courage, dedication, and the evolution of an industry that connected the world.

© 2025 Golden Wings Documentary'''

    print("🔐 Authenticating with YouTube...")
    youtube = get_authenticated_service()

    print(f"📁 Uploading video: {VIDEO_FILE}")
    result = upload_video(youtube, VIDEO_FILE, TITLE, DESCRIPTION, 'unlisted')

    print("\n🎉 DONE! Your video is live (unlisted)")
    print(f"Share this link: https://www.youtube.com/watch?v={result['id']}")
