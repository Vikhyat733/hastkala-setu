from fastapi import APIRouter
from app.services.payments import payment_service

router = APIRouter()


@router.post("/payout")
async def request_payout(artisan_id: str, amount: float, upi_id: str):
    return await payment_service.initiate_payout(artisan_id, amount, upi_id)
