#!/bin/bash

SCRIPT_ID="1sZ01mZ-5NkWvAgkz_yuwVV2Az8YaJNkimZoS1yk6wUudq0e55iI1GRO9"
ACCESS_TOKEN=$(cat ~/.clasprc.json | python3 -c "import sys, json; print(json.load(sys.stdin)['tokens']['default']['access_token'])")

curl -X POST \
  "https://script.googleapis.com/v1/projects/${SCRIPT_ID}/deployments" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "versionNumber": 1,
    "manifestFileName": "appsscript",
    "description": "Golden Wings RSVP Webhook - Public Access",
    "entryPoints": [
      {
        "entryPointType": "WEB_APP",
        "webApp": {
          "executeAs": "USER_DEPLOYING",
          "access": "ANYONE"
        }
      }
    ]
  }'
