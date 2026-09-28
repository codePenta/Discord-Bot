#!/bin/sh

if [ ! -f /tmp/bot-health ]; then
  echo "Health file not found"
  exit 1
fi

TIMESTAMP=$(grep -o '"timestamp":[0-9]*' /tmp/bot-health | cut -d: -f2)
CURRENT_TIME=$(date +%s000)
AGE=$((CURRENT_TIME - TIMESTAMP))

if [ $AGE -gt 90000 ]; then
  echo "Health status stale (${AGE}ms old)"
  exit 1
fi

STATUS=$(grep -o '"status":"[^"]*' /tmp/bot-health | cut -d'"' -f4)
if [ "$STATUS" != "healthy" ]; then
  echo "Bot status: $STATUS"
  exit 1
fi

echo "Bot is healthy"
exit 0
