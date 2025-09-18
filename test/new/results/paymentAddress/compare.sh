#!/bin/bash

for addr in $(ls *_gql_blockfrost.json 2>/dev/null | sed 's/_gql_blockfrost.json//' | sort); do
  gql="${addr}_gql_blockfrost.json"
  stripped="${addr}_blockfrost_stripped.json"

  if [[ -f "$gql" && -f "$stripped" ]]; then
    echo "Comparing: $gql  <->  $stripped"
    diff -u <(jq -S . "$gql") <(jq -S . "$stripped") > "${addr}_diff.txt"

    if [[ -s "${addr}_diff.txt" ]]; then
      echo "  Differences saved to ${addr}_diff.txt"
    else
      echo "  No differences found"
      rm "${addr}_diff.txt"
    fi
  fi
done
