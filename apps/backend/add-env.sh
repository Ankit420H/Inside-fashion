#!/bin/bash
while IFS='=' read -r key value; do
  if [[ -n "$key" && -n "$value" && ! "$key" =~ ^# ]]; then
    echo -n "$value" | npx vercel env add "$key" production --yes
  fi
done < <(cat /Users/ankitkumaryadav/Documents/Inside-fashion/.env | grep -v '^#' | grep -v '^$')
