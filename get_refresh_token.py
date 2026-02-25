#!/usr/bin/env python3
"""
Generate a refresh token for Google Ads API.

Usage:
    python get_refresh_token.py

Prerequisites:
    - credentials.json from Google Cloud Console (OAuth 2.0 Desktop client)
    - google-ads scope must be enabled for the OAuth client

The refresh token will be printed to stdout — paste it into google-ads.yaml.
"""
import json
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ["https://www.googleapis.com/auth/adwords"]

flow = InstalledAppFlow.from_client_secrets_file("credentials.json", scopes=SCOPES)
creds = flow.run_local_server(port=0)

print("\n--- Copy this refresh_token into google-ads.yaml ---")
print(f"refresh_token: {creds.refresh_token}")
print("\nclient_id and client_secret are in credentials.json:")
with open("credentials.json") as f:
    data = json.load(f)
    client = data.get("installed") or data.get("web", {})
    print(f"client_id:     {client.get('client_id')}")
    print(f"client_secret: {client.get('client_secret')}")
