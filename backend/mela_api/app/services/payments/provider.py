"""Payment Provider Abstraction Layer

Defines strict separation between Order Status and Payment Status.
Provides clean interface for future real payment gateways (Razorpay, UPI, Stripe)
while maintaining clearly labeled Demo Payment Mode for development.
"""
from abc import ABC, abstractmethod
from enum import Enum
from typing import Dict, Any, Optional


class PaymentStatus(str, Enum):
    NOT_REQUIRED = "NOT_REQUIRED"
    PENDING = "PENDING"
    PAID = "PAID"
    FAILED = "FAILED"
    REFUNDED = "REFUNDED"
    DEMO_MODE = "DEMO_MODE"


class IPaymentProvider(ABC):
    """Abstract interface for payment gateway implementations."""

    @abstractmethod
    def create_payment_intent(self, order_id: str, amount: float, currency: str = "INR") -> Dict[str, Any]:
        """Create a payment intent or checkout session."""
        pass

    @abstractmethod
    def verify_payment(self, payment_reference: str) -> Dict[str, Any]:
        """Verify payment confirmation with gateway."""
        pass

    @abstractmethod
    def initiate_payout(self, artisan_id: str, amount: float, account_details: Dict[str, Any]) -> Dict[str, Any]:
        """Initiate payout settlement to artisan."""
        pass


class DemoPaymentProvider(IPaymentProvider):
    """Demo payment provider: clearly indicates integration is not connected yet."""

    def create_payment_intent(self, order_id: str, amount: float, currency: str = "INR") -> Dict[str, Any]:
        return {
            "status": PaymentStatus.DEMO_MODE.value,
            "provider": "DEMO",
            "order_id": order_id,
            "amount": amount,
            "currency": currency,
            "is_real_payment": False,
            "message": "Payment gateway will be integrated in the next phase. Running in Demo Order Mode."
        }

    def verify_payment(self, payment_reference: str) -> Dict[str, Any]:
        return {
            "status": PaymentStatus.DEMO_MODE.value,
            "payment_reference": payment_reference,
            "is_real_payment": False,
            "verified": True
        }

    def initiate_payout(self, artisan_id: str, amount: float, account_details: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "status": "DEMO_PAYOUT_SCHEDULED",
            "artisan_id": artisan_id,
            "amount": amount,
            "is_real_payment": False,
            "message": "Demo payout recorded. Real automated bank transfer will be available in the payments phase."
        }
