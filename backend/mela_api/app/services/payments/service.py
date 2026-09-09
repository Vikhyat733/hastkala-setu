"""Payment Service Layer

Manages payment workflows, provider resolution, settlement scheduling, and payout accounts.
Maintains strict security isolation: Never stores raw card numbers, CVVs, UPI PINs, or bank passwords.
"""
from typing import Dict, Any, Optional
from app.services.payments.provider import IPaymentProvider, DemoPaymentProvider, PaymentStatus


class PaymentService:
    """Orchestrates payments using pluggable provider strategies."""

    def __init__(self, provider: Optional[IPaymentProvider] = None):
        # Default to DemoPaymentProvider for development
        self.provider: IPaymentProvider = provider or DemoPaymentProvider()

    def set_provider(self, provider: IPaymentProvider) -> None:
        """Dynamically switch payment provider (e.g. Razorpay in production)."""
        self.provider = provider

    def create_order_payment(self, order_id: str, amount: float) -> Dict[str, Any]:
        """Initiate payment session for a placed order."""
        return self.provider.create_payment_intent(order_id, amount)

    def verify_order_payment(self, payment_reference: str) -> Dict[str, Any]:
        """Verify payment outcome."""
        return self.provider.verify_payment(payment_reference)

    async def initiate_payout(self, artisan_id: str, amount: float, upi_id: str) -> Dict[str, Any]:
        """Initiate artisan payout disbursement."""
        return self.provider.initiate_payout(
            artisan_id=artisan_id,
            amount=amount,
            account_details={"upi_id": upi_id, "mode": "UPI"}
        )


payment_service = PaymentService()
