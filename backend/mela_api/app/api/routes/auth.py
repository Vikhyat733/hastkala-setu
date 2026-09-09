from fastapi import APIRouter
from app.services.auth import auth_service

router = APIRouter()


@router.post("/request-otp")
async def request_otp(phone: str):
    return await auth_service.request_otp(phone)


@router.post("/verify-otp")
async def verify_otp(phone: str, otp: str):
    return await auth_service.verify_otp(phone, otp)
