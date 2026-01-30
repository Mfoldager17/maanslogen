#!/usr/bin/env bash
# Test MinIO presign → upload → create beverage.
# Du indtaster ikke nogen billed-URL: API returnerer "url" efter presign; du uploader filen
# til "uploadUrl", og bruger derefter den returnerede "url" når du opretter beverage.
# Forudsætninger: API kører (npm run start:dev), MinIO kører, Node.js på PATH.
# Brug: ./scripts/test-minio-upload.sh [base URL]

set -e
API_URL="${1:-http://localhost:3000}"
json() { node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8')); $1"; }

echo "1. Henter beverage type id..."
TYPE_ID=$(curl -s "$API_URL/beverage-types" | json "console.log((Array.isArray(d)?d[0]:d)?.['id']||'')")
if [ -z "$TYPE_ID" ]; then
  echo "Fejl: Ingen beverage types. Kør seed først (fx npx ts-node src/prisma/seed2.ts)."
  exit 1
fi
echo "   Type ID: $TYPE_ID"

echo "2. Henter presigned URL (beverage-images)..."
PRESIGN=$(curl -s -X POST "$API_URL/minio/presign/beverage-images" \
  -H "Content-Type: application/json" \
  -d '{"uploads":[{"type":"THUMBNAIL"}]}')
UPLOAD_URL=$(echo "$PRESIGN" | json "console.log(d?.uploads?.[0]?.uploadUrl||'')")
IMAGE_URL=$(echo "$PRESIGN" | json "console.log(d?.uploads?.[0]?.url||'')")
if [ -z "$UPLOAD_URL" ]; then
  echo "Fejl: Kunne ikke hente presigned URL. Tjek at MinIO env er sat og API kører."
  echo "$PRESIGN" | json "console.log(JSON.stringify(d,null,2))"
  exit 1
fi
echo "   Upload URL: ${UPLOAD_URL:0:60}..."
echo "   Billed-URL (til beverage): $IMAGE_URL"

echo "3. Henter 500x500 testbillede og uploader til MinIO..."
curl -sL "https://placehold.co/500x500.png" -o /tmp/maanslogen-test.png
HTTP=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$UPLOAD_URL" \
  -H "Content-Type: image/png" \
  --data-binary @/tmp/maanslogen-test.png)
if [ "$HTTP" != "200" ]; then
  echo "Fejl: PUT returnerede HTTP $HTTP. Tjek MinIO og at presigned URL er gyldig."
  exit 1
fi
echo "   HTTP $HTTP OK (500x500 PNG uploadet)"

echo "4. Opretter beverage med billed-URL..."
BEV=$(curl -s -X POST "$API_URL/beverages" \
  -H "Content-Type: application/json" \
  -d "{\"beverageTypeId\":\"$TYPE_ID\",\"brand\":\"Test\",\"name\":\"MinIO Test\",\"country\":\"DK\",\"images\":[{\"url\":\"$IMAGE_URL\",\"type\":\"THUMBNAIL\"}]}")
BEV_ID=$(echo "$BEV" | json "console.log(d?.id||'')")
if [ -n "$BEV_ID" ]; then
  echo "   Beverage oprettet: $BEV_ID"
  echo ""
  echo "✅ Hele flowet virkede. Åbn billed-URL i browser for at se det 500x500 testbillede:"
  echo "   $IMAGE_URL"
else
  echo "Fejl ved oprettelse af beverage:"
  echo "$BEV" | json "console.log(JSON.stringify(d,null,2))" 2>/dev/null || echo "$BEV"
  exit 1
fi
