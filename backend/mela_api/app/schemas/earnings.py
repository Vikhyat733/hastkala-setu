"""Earnings & Payout Pydantic Schemas"""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class PayoutAccountRequest(BaseModel):
    """Payload for configuring or updating an artisan payout account."""
    account_holder_name: str = Field(..., min_length=2, max_length=150, description="Name as per bank/UPI records")
    payout_type: str = Field(default="UPI", description="Payout mechanism: UPI or BANK_TRANSFER")
    upi_id: Optional[str] = Field(None, description="VPA handle (e.g. artisan@upi)")
    account_number_masked: Optional[str] = Field(None, description="Masked bank account number ending with last 4 digits")
    ifsc_code: Optional[str] = Field(None, description="Bank branch IFSC code")
    bank_name: Optional[str] = Field(None, description="Name of the bank")


class PayoutAccountResponse(BaseModel):
    """Safe payout account summary without exposing credentials."""
    is_connected: bool
    account_holder_name: Optional[str] = None
    payout_type: str = "UPI"
    upi_id: Optional[str] = None
    account_masked: Optional[str] = None
    bank_name: Optional[str] = None
    is_verified: bool = False
    updated_at: Optional[datetime] = None


class RecentSaleItem(BaseModel):
    """Snapshot breakdown of an individual completed sale item."""
    order_id: str
    order_date: datetime
    product_id: str
    product_title: str
    product_image: Optional[str] = None
    quantity: int
    unit_price: float
    subtotal: float
    order_total: float
    status: str
    buyer_name: str
    buyer_location: str


class EarningsSummaryResponse(BaseModel):
    """Comprehensive business sales and net earnings metrics."""
    artisan_id: str
    period: str  # "this_month" | "last_month" | "all_time"
    total_sales: float
    completed_orders: int
    products_sold: int
    platform_fee: float = 0.0
    delivery_fee: float = 0.0
    net_earnings: float
    pending_orders_count: int = 0
    pending_orders_amount: float = 0.0
    currency: str = "INR"
    payout_status: str  # "CONNECTED" | "NOT_CONNECTED"
    payout_account: Optional[PayoutAccountResponse] = None
