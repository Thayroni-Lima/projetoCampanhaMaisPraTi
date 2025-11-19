#!/usr/bin/env bash
set -euo pipefail
API=${API_URL:-http://localhost:8080}

TS=$(date +%s)
EMAIL="tester_${TS}@example.com"
PASS="senha123"

printf "\n== Registro de usuário (%s) ==\n" "$EMAIL"
REG=$(curl -s -X POST "$API/auth/register" -H "Content-Type: application/json" \
  -d '{"name":"Tester","email":"'$EMAIL'","password":"'$PASS'","city":"Porto","state":"RS"}')
 echo "$REG" | jq '.email? // .message?'

printf "\n== Login ==\n"
TOKEN=$(curl -s -X POST "$API/auth/login" -H "Content-Type: application/json" \
  -d '{"email":"'$EMAIL'","password":"'$PASS'"}' | jq -r '.token')
if [[ -z "$TOKEN" || "$TOKEN" == "null" ]]; then
  echo "Falha no login" >&2; exit 1
fi
 echo "Token prefix: ${TOKEN:0:16}"

printf "\n== Criar campanha ==\n"
CAMP=$(curl -s -X POST "$API/campaigns" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"goal":500.00,"deadline":"2030-12-31T00:00:00Z","title":"Campanha Teste","description":"Desc","preview":"Prev","category":"SOCIAL","city":"Porto","state":"RS","imageUrl":null}')
echo "$CAMP" | jq '{id:.id, goal:.goal, amountRaised:.amountRaised, donationsCount:.donationsCount}'
CID=$(echo "$CAMP" | jq -r '.id')

printf "\n== Doar 150.00 ==\n"
DON1=$(curl -s -X POST "$API/campaigns/$CID/donations" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"amount":"150.00"}')
echo "$DON1" | jq '{amountRaised:.amountRaised, donationsCount:.donationsCount}'

printf "\n== Doar 400.00 (ultrapassa meta) ==\n"
DON2=$(curl -s -X POST "$API/campaigns/$CID/donations" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"amount":"400.00"}')
echo "$DON2" | jq '{amountRaised:.amountRaised, donationsCount:.donationsCount}'

printf "\n== Estado final da campanha ==\n"
FINAL=$(curl -s -H "Authorization: Bearer $TOKEN" "$API/campaigns/$CID")
echo "$FINAL" | jq '{goal:.goal, amountRaised:.amountRaised, donationsCount:.donationsCount}'

printf "\n== Teste de erro (valor 0) ==\n"
ERR=$(curl -s -X POST "$API/campaigns/$CID/donations" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"amount":"0"}')
echo "$ERR" | jq '.message? // .error?'

RAISED=$(echo "$FINAL" | jq -r '.amountRaised')
if (( $(echo "$RAISED > 500" | bc -l) )); then
  echo "\n✔ Teste OK: amountRaised ($RAISED) ultrapassou meta 500.00"
else
  echo "\n✘ Teste FALHOU: amountRaised ($RAISED) não ultrapassou meta"; exit 1
fi
