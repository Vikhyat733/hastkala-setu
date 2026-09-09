# MELA Cloud Deployment Guide

## Production Architecture
- **API Gateway**: Nginx / AWS ALB / GCP Cloud Run with HTTPS SSL termination.
- **Backend API**: Containerized FastAPI service autoscaled across availability zones.
- **Relational Storage**: Managed PostgreSQL (AWS RDS or Supabase) with automated snapshots.
- **Static Assets & Media**: AWS S3 / Cloudflare R2 bucket for original and AI-enhanced craft photos.
- **AI Inference**: GPU-backed workers (FastAPI / Celery) or managed model endpoints (e.g. Gemini Vertex AI).
- **Mobile Distribution**: Android APK / App Bundle via Google Play Store / F-Droid, iOS via TestFlight / App Store.
