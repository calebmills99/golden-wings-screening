#!/bin/bash

curl -X POST https://gwingz-worker.calebmills99.workers.dev/api/rsvp \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phone":"555-1234","specialRequests":"Testing webhook","source":"script_test"}'
