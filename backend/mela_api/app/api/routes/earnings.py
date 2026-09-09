"""Earnings & Settlements REST Router"""
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.services.earnings.service import earnings_service
from app.schemas.earnings import (
    EarningsSummaryResponse,
    RecentSaleItem,
    PayoutAccountRequest,
    PayoutAccountResponse,
)

router = APIRouter()


@router.get("/summary", response_model=EarningsSummaryResponse)
def get_earnings_summary(
    period: str = Query("this_month", description="Time period: this_month, last_month, all_time"),
    artisan_id: Optional[str] = Query(None, description="Optional artisan ID context"),
    db: Session = Depends(get_db),
):
    """Retrieve summarized sales, net earnings, products sold, and pending metrics."""
    effective_id = artisan_id or "artisan_demo_radha_1"
    return earnings_service.get_artisan_earnings(db, effective_id, period)


@router.get("/recent", response_model=List[RecentSaleItem])
def get_recent_sales(
    artisan_id: Optional[str] = Query(None, description="Optional artisan ID context"),
    limit: int = Query(10, ge=1, le=50, description="Max recent items to fetch"),
    db: Session = Depends(get_db),
):
    """Retrieve recent completed sale items with price and title snapshots."""
    effective_id = artisan_id or "artisan_demo_radha_1"
    return earnings_service.get_recent_sales(db, effective_id, limit)


@router.get("/payout/account", response_model=PayoutAccountResponse)
def get_payout_account_details(
    artisan_id: Optional[str] = Query(None, description="Optional artisan ID context"),
    db: Session = Depends(get_db),
):
    """Retrieve connected payout account details without exposing credentials."""
    effective_id = artisan_id or "artisan_demo_radha_1"
    return earnings_service.get_payout_account(db, effective_id)


@router.post("/payout/account", response_model=PayoutAccountResponse)
def configure_payout_account(
    payload: PayoutAccountRequest,
    artisan_id: Optional[str] = Query(None, description="Optional artisan ID context"),
    db: Session = Depends(get_db),
):
    """Configure or update artisan payout account."""
    effective_id = artisan_id or "artisan_demo_radha_1"
    return earnings_service.save_payout_account(db, effective_id, payload)


@router.get("/{artisan_id}", response_model=EarningsSummaryResponse)
def get_legacy_earnings(
    artisan_id: str,
    period: str = Query("this_month"),
    db: Session = Depends(get_db),
):
    """Backwards-compatible path for artisan earnings."""
    return earnings_service.get_artisan_earnings(db, artisan_id, period)
