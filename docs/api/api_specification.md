# MELA REST API Specification

All endpoints are versioned with the base path: `/api/v1/`

## Base Health Endpoint
- `GET /api/v1/health`
  - Response:
    ```json
    {
      "status": "ok",
      "service": "MELA API"
    }
    ```

## Authentication Routes (`/api/v1/auth`)
- `POST /api/v1/auth/request-otp` - Request mobile OTP for artisan authentication
- `POST /api/v1/auth/verify-otp` - Verify OTP & obtain JWT token
- `GET /api/v1/auth/me` - Fetch authenticated artisan profile

## Products & Catalog Routes (`/api/v1/products`)
- `GET /api/v1/products` - List products with category/price filtering
- `POST /api/v1/products` - Create product draft
- `GET /api/v1/products/{id}` - Get product detail
- `PUT /api/v1/products/{id}` - Update product attributes
- `DELETE /api/v1/products/{id}` - Archive/delete product

## AI Subsystem Routes (`/api/v1/ai`)
- `POST /api/v1/ai/enhance-image` - Background removal and lighting enhancement
- `POST /api/v1/ai/transcribe-voice` - Vernacular voice-to-text craft description
- `POST /api/v1/ai/recommend-price` - Fair-pricing engine estimation
- `POST /api/v1/ai/generate-story` - AI artisan storytelling & craft heritage pitch

## Orders & Buyers Routes (`/api/v1/orders`, `/api/v1/buyers`)
- `GET /api/v1/orders` - List artisan order pipeline
- `POST /api/v1/orders/{id}/status` - Update delivery & fulfillment status
- `GET /api/v1/buyers/inquiries` - B2B bulk inquiries
