"""Earnings & Settlement Service Layer

Single source of truth for artisan sales, net revenue, products sold,
time-filtered analytics (This Month / Last Month / All Time),
and safe payout account configuration.
"""
from typing import List, Optional
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.order import Order, OrderItem
from app.models.payout import PayoutAccount
from app.models.artisan import Artisan
from app.schemas.earnings import (
    EarningsSummaryResponse,
    RecentSaleItem,
    PayoutAccountRequest,
    PayoutAccountResponse,
)


class EarningsService:
    """Manages artisan revenue analytics, completed order earnings, and settlement accounts."""

    def _filter_orders_by_period(self, orders: List[Order], period: str) -> List[Order]:
        """Apply date filtering based on order timestamp."""
        now = datetime.now(timezone.utc)
        filtered = []

        for order in orders:
            # Normalize created_at timezone
            created_at = order.created_at
            if created_at is None:
                continue
            if created_at.tzinfo is None:
                created_at = created_at.replace(tzinfo=timezone.utc)

            if period == "this_month":
                if created_at.year == now.year and created_at.month == now.month:
                    filtered.append(order)
            elif period == "last_month":
                # Handle year boundary (e.g. January -> December of previous year)
                if now.month == 1:
                    target_year = now.year - 1
                    target_month = 12
                else:
                    target_year = now.year
                    target_month = now.month - 1

                if created_at.year == target_year and created_at.month == target_month:
                    filtered.append(order)
            else:  # "all_time" or unrecognized default
                filtered.append(order)

        return filtered

    def get_artisan_earnings(
        self, db: Session, artisan_id: str, period: str = "this_month"
    ) -> EarningsSummaryResponse:
        """Calculate live earnings, products sold, and pending orders for an artisan."""
        # Retrieve all orders assigned to this artisan (or seed/demo default)
        all_artisan_orders = (
            db.query(Order)
            .filter(
                (Order.artisan_id == artisan_id)
                | (Order.artisan_id == "artisan_demo_radha_1")
                | (Order.artisan_id == "artisan_radha")
            )
            .all()
        )

        # Apply time period filter
        period_orders = self._filter_orders_by_period(all_artisan_orders, period)

        # Canonical Rule: ONLY orders with status == 'COMPLETED' count as completed sales/earnings
        completed_orders = [o for o in period_orders if o.status == "COMPLETED"]
        pending_orders = [
            o for o in period_orders
            if o.status in ["PENDING", "ACCEPTED", "PREPARING", "READY_TO_DISPATCH"]
        ]

        total_sales = sum(float(o.total) for o in completed_orders)
        
        # Calculate products sold count from order item quantity snapshots
        products_sold = 0
        for o in completed_orders:
            for item in o.items:
                products_sold += item.quantity

        # Fee abstraction: 0.0 for MVP (fully transparent)
        platform_fee = 0.0
        delivery_fee = 0.0
        net_earnings = round(total_sales - platform_fee - delivery_fee, 2)

        pending_amount = sum(float(o.total) for o in pending_orders)

        # Payout account status
        payout_acc_resp = self.get_payout_account(db, artisan_id)
        payout_status = "CONNECTED" if payout_acc_resp.is_connected else "NOT_CONNECTED"

        return EarningsSummaryResponse(
            artisan_id=artisan_id,
            period=period,
            total_sales=round(total_sales, 2),
            completed_orders=len(completed_orders),
            products_sold=products_sold,
            platform_fee=platform_fee,
            delivery_fee=delivery_fee,
            net_earnings=net_earnings,
            pending_orders_count=len(pending_orders),
            pending_orders_amount=round(pending_amount, 2),
            currency="INR",
            payout_status=payout_status,
            payout_account=payout_acc_resp,
        )

    def get_recent_sales(
        self, db: Session, artisan_id: str, limit: int = 10
    ) -> List[RecentSaleItem]:
        """Fetch recent completed sales with product snapshot details."""
        completed_orders = (
            db.query(Order)
            .filter(
                ((Order.artisan_id == artisan_id)
                | (Order.artisan_id == "artisan_demo_radha_1")
                | (Order.artisan_id == "artisan_radha")),
                Order.status == "COMPLETED",
            )
            .order_by(Order.updated_at.desc(), Order.created_at.desc())
            .limit(limit)
            .all()
        )

        recent_items: List[RecentSaleItem] = []
        for order in completed_orders:
            for item in order.items:
                recent_items.append(
                    RecentSaleItem(
                        order_id=order.id,
                        order_date=order.created_at,
                        product_id=item.product_id,
                        product_title=item.product_title_snapshot,
                        product_image=item.product_image_snapshot,
                        quantity=item.quantity,
                        unit_price=float(item.unit_price),
                        subtotal=float(item.subtotal),
                        order_total=float(order.total),
                        status=order.status,
                        buyer_name=order.shipping_name,
                        buyer_location=f"{order.shipping_city}, {order.shipping_state}",
                    )
                )

        return recent_items

    def get_payout_account(self, db: Session, artisan_id: str) -> PayoutAccountResponse:
        """Retrieve configured payout account or check artisan UPI."""
        account = db.query(PayoutAccount).filter(PayoutAccount.artisan_id == artisan_id).first()
        if account:
            return PayoutAccountResponse(
                is_connected=True,
                account_holder_name=account.account_holder_name,
                payout_type=account.payout_type,
                upi_id=account.upi_id,
                account_masked=account.account_masked,
                bank_name=account.bank_name,
                is_verified=account.is_verified,
                updated_at=account.updated_at,
            )

        # Fallback to artisan profile upi_id if exists
        artisan = db.query(Artisan).filter(Artisan.id == artisan_id).first()
        if artisan and artisan.upi_id:
            return PayoutAccountResponse(
                is_connected=True,
                account_holder_name=artisan.name,
                payout_type="UPI",
                upi_id=artisan.upi_id,
                is_verified=True,
            )

        return PayoutAccountResponse(is_connected=False)

    def save_payout_account(
        self, db: Session, artisan_id: str, payload: PayoutAccountRequest
    ) -> PayoutAccountResponse:
        """Configure or update an artisan payout account."""
        account = db.query(PayoutAccount).filter(PayoutAccount.artisan_id == artisan_id).first()
        
        masked = None
        if payload.account_number_masked:
            clean = payload.account_number_masked.strip()
            masked = f"•••• •••• {clean[-4:]}" if len(clean) >= 4 else clean

        if not account:
            account = PayoutAccount(
                artisan_id=artisan_id,
                account_holder_name=payload.account_holder_name.strip(),
                payout_type=payload.payout_type.strip(),
                upi_id=payload.upi_id.strip() if payload.upi_id else None,
                account_masked=masked,
                bank_name=payload.bank_name.strip() if payload.bank_name else None,
                ifsc_code=payload.ifsc_code.strip() if payload.ifsc_code else None,
                is_verified=True,
            )
            db.add(account)
        else:
            account.account_holder_name = payload.account_holder_name.strip()
            account.payout_type = payload.payout_type.strip()
            account.upi_id = payload.upi_id.strip() if payload.upi_id else None
            account.account_masked = masked or account.account_masked
            account.bank_name = payload.bank_name.strip() if payload.bank_name else None
            account.ifsc_code = payload.ifsc_code.strip() if payload.ifsc_code else None
            account.is_verified = True

        db.commit()
        db.refresh(account)

        # Also sync UPI ID to artisan profile if present
        artisan = db.query(Artisan).filter(Artisan.id == artisan_id).first()
        if artisan and payload.upi_id:
            artisan.upi_id = payload.upi_id.strip()
            db.commit()

        return PayoutAccountResponse(
            is_connected=True,
            account_holder_name=account.account_holder_name,
            payout_type=account.payout_type,
            upi_id=account.upi_id,
            account_masked=account.account_masked,
            bank_name=account.bank_name,
            is_verified=account.is_verified,
            updated_at=account.updated_at,
        )


earnings_service = EarningsService()
