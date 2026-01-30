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

echo "2. Henter presigned URLs (THUMBNAIL + LARGE, samme id)..."
# Bruger dedikeret test-bucket så den oprettes med public policy hvis den ikke findes
PRESIGN=$(curl -s -X POST "$API_URL/upload/presign/beverage-images" \
  -H "Content-Type: application/json" \
  -H "X-Test-Bucket: maanslogen-test-upload" \
  -d '{"uploads":[{"type":"THUMBNAIL"},{"type":"LARGE"}]}')
UPLOAD_URL_THUMB=$(echo "$PRESIGN" | json "console.log(d?.uploads?.[0]?.uploadUrl||'')")
UPLOAD_URL_LARGE=$(echo "$PRESIGN" | json "console.log(d?.uploads?.[1]?.uploadUrl||'')")
IMAGE_URL_THUMB=$(echo "$PRESIGN" | json "console.log(d?.uploads?.[0]?.url||'')")
IMAGE_URL_LARGE=$(echo "$PRESIGN" | json "console.log(d?.uploads?.[1]?.url||'')")
if [ -z "$UPLOAD_URL_THUMB" ] || [ -z "$UPLOAD_URL_LARGE" ]; then
  echo "Fejl: Kunne ikke hente presigned URLs. Tjek at MinIO env er sat og API kører."
  echo "$PRESIGN" | json "console.log(JSON.stringify(d,null,2))"
  exit 1
fi
WIDTH_THUMB=$(echo "$PRESIGN" | json "console.log(d?.uploads?.[0]?.width||'')")
HEIGHT_THUMB=$(echo "$PRESIGN" | json "console.log(d?.uploads?.[0]?.height||'')")
WIDTH_LARGE=$(echo "$PRESIGN" | json "console.log(d?.uploads?.[1]?.width||'')")
HEIGHT_LARGE=$(echo "$PRESIGN" | json "console.log(d?.uploads?.[1]?.height||'')")
echo "   THUMBNAIL URL: $IMAGE_URL_THUMB (${WIDTH_THUMB}x${HEIGHT_THUMB})"
echo "   LARGE URL:     $IMAGE_URL_LARGE (${WIDTH_LARGE}x${HEIGHT_LARGE})"

echo "3. Henter testbillede, laver lille + stor version, uploader til begge slots..."
curl -sL "https://placehold.co/500x500.png" -o /tmp/maanslogen-test.png
# Lav lille version (thumbnail) og stor version (large) med sips (macOS) – ellers brug samme fil
if command -v sips >/dev/null 2>&1; then
  sips -z "$HEIGHT_THUMB" "$WIDTH_THUMB" /tmp/maanslogen-test.png --out /tmp/maanslogen-test-thumb.png 2>/dev/null || cp /tmp/maanslogen-test.png /tmp/maanslogen-test-thumb.png
  sips -z "$HEIGHT_LARGE" "$WIDTH_LARGE" /tmp/maanslogen-test.png --out /tmp/maanslogen-test-large.png 2>/dev/null || cp /tmp/maanslogen-test.png /tmp/maanslogen-test-large.png
  FILE_THUMB=/tmp/maanslogen-test-thumb.png
  FILE_LARGE=/tmp/maanslogen-test-large.png
else
  FILE_THUMB=/tmp/maanslogen-test.png
  FILE_LARGE=/tmp/maanslogen-test.png
fi
HTTP1=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$UPLOAD_URL_THUMB" \
  -H "Content-Type: image/png" \
  --data-binary @"$FILE_THUMB")
HTTP2=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$UPLOAD_URL_LARGE" \
  -H "Content-Type: image/png" \
  --data-binary @"$FILE_LARGE")
if [ "$HTTP1" != "200" ] || [ "$HTTP2" != "200" ]; then
  echo "Fejl: PUT returnerede HTTP $HTTP1 / $HTTP2. Tjek MinIO og presigned URLs."
  exit 1
fi
echo "   Lille (${WIDTH_THUMB}x${HEIGHT_THUMB}): HTTP $HTTP1 OK"
echo "   Stor (${WIDTH_LARGE}x${HEIGHT_LARGE}): HTTP $HTTP2 OK"

echo "4. Opretter beverage med begge billed-URL'er + width/height..."
# Escaping URLs for JSON: replace " with \"
IMAGE_URL_THUMB_ESC=$(echo "$IMAGE_URL_THUMB" | sed 's/"/\\"/g')
IMAGE_URL_LARGE_ESC=$(echo "$IMAGE_URL_LARGE" | sed 's/"/\\"/g')
BEV=$(curl -s -X POST "$API_URL/beverages" \
  -H "Content-Type: application/json" \
  -d "{\"beverageTypeId\":\"$TYPE_ID\",\"brand\":\"Test\",\"name\":\"MinIO Test\",\"country\":\"DK\",\"images\":[{\"url\":\"$IMAGE_URL_THUMB_ESC\",\"type\":\"THUMBNAIL\",\"width\":$WIDTH_THUMB,\"height\":$HEIGHT_THUMB},{\"url\":\"$IMAGE_URL_LARGE_ESC\",\"type\":\"LARGE\",\"width\":$WIDTH_LARGE,\"height\":$HEIGHT_LARGE}]}")
BEV_ID=$(echo "$BEV" | json "console.log(d?.id||'')")
if [ -n "$BEV_ID" ]; then
  echo "   Beverage oprettet: $BEV_ID"
  echo ""
  echo "✅ Hele flowet virkede. Billedet er gemt i lille + stor størrelse (keyPrefix/id/widthxheight):"
  echo "   Lille (${WIDTH_THUMB}x${HEIGHT_THUMB}): $IMAGE_URL_THUMB"
  echo "   Stor (${WIDTH_LARGE}x${HEIGHT_LARGE}):  $IMAGE_URL_LARGE"
else
  echo "Fejl ved oprettelse af beverage:"
  echo "$BEV" | json "console.log(JSON.stringify(d,null,2))" 2>/dev/null || echo "$BEV"
  exit 1
fi
