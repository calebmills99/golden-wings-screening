#!/bin/bash

curl -X POST https://script.google.com/macros/s/AKfycbxnU3k4duWhFRaMPnUVyp7NaGxG6qPN2Py43eNwCBZz8S0DN5xcMLgUdMAMb7iQ-ewQsg/exec \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phone":"555-1234","specialRequests":"Testing webhook","source":"script_test"}'
