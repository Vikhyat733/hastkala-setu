"""Order Management Service Layer

Handles atomic order creation with price snapshots, stock reservation,
canonical state machine transitions, cancellation with stock restoration,
and artisan/buyer order queries.
"""
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from decimal import Decimal
from datetime import datetime, timezone
from fastapi import HTTPException

from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.artisan import Artisan
from app.schemas.order import OrderCreateRequest, OrderResponse, OrderItemResponse


# Canonical State Machine Allowed Transitions
VALID_TRANSITIONS: Dict[str, List[str]] = {
    "PENDING": ["ACCEPTED", "CANCELLED"],
    "ACCEPTED": ["PREPARING", "CANCELLED"],
    "PREPARING": ["READY_TO_DISPATCH", "CANCELLED"],
    "READY_TO_DISPATCH": ["DISPATCHED", "CANCELLED"],
    "DISPATCHED": ["DELIVERED"],
    "DELIVERED": ["COMPLETED"],
    "COMPLETED": [],
    "CANCELLED": [],
}


class OrderService:
    """Manages order creation, lifecycle transitions, dispatch tracking, and fulfillment."""

    def _enrich_order_response(self, db: Session, order: Order) -> OrderResponse:
        """Enriches Order model with artisan name, location and formatted item responses."""
        artisan = db.query(Artisan).filter(Artisan.id == order.artisan_id).first()
        artisan_name = artisan.name if artisan else "राधा देवी (Radha Devi)"
        artisan_location = f"{artisan.district or 'जयपुर'}, {artisan.state or 'राजस्थान'}" if artisan else "जयपुर, राजस्थान"

        item_responses = [
            OrderItemResponse(
                id=item.id,
                product_id=item.product_id,
                product_title_snapshot=item.product_title_snapshot,
                product_image_snapshot=item.product_image_snapshot,
                unit_price=item.unit_price,
                quantity=item.quantity,
                subtotal=item.subtotal,
            )
            for item in order.items
        ]

        return OrderResponse(
            id=order.id,
            buyer_id=order.buyer_id,
            artisan_id=order.artisan_id,
            status=order.status,
            subtotal=order.subtotal,
            delivery_charge=order.delivery_charge,
            total=order.total,
            shipping_name=order.shipping_name,
            shipping_phone=order.shipping_phone,
            shipping_address=order.shipping_address,
            shipping_city=order.shipping_city,
            shipping_state=order.shipping_state,
            shipping_pincode=order.shipping_pincode,
            items=item_responses,
            created_at=order.created_at,
            updated_at=order.updated_at,
            artisan_name=artisan_name,
            artisan_location=artisan_location,
        )

    def create_order(self, db: Session, req: OrderCreateRequest) -> OrderResponse:
        """
        Atomically creates order, decrements product stock, captures price/title snapshots,
        and guarantees atomic consistency.
        """
        if not req.items or len(req.items) == 0:
            raise HTTPException(status_code=400, detail="Order must contain at least one item.")

        subtotal_acc = Decimal("0.00")
        order_items_to_create = []
        target_artisan_id = None

        try:
            for item_in in req.items:
                # Lock/query product
                product = db.query(Product).filter(Product.id == item_in.product_id).first()
                if not product:
                    raise HTTPException(status_code=404, detail=f"Product with id '{item_in.product_id}' not found.")

                if product.status not in ["published", "out_of_stock"]:
                    raise HTTPException(status_code=400, detail="This product is not currently available for purchase.")

                # Buyer cannot purchase their own product if artisan is logged in
                if req.buyer_id and req.buyer_id == product.artisan_id:
                    raise HTTPException(status_code=400, detail="Artisans cannot purchase their own product listings.")

                # Check stock availability
                available_stock = product.stock if product.stock is not None else 0
                if available_stock < item_in.quantity:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Insufficient stock for '{product.title}'. Only {available_stock} available."
                    )

                # Atomically decrement stock
                product.stock = available_stock - item_in.quantity
                if product.stock == 0:
                    product.status = "out_of_stock"

                # Snapshot calculation
                unit_price = Decimal(str(product.price))
                item_subtotal = unit_price * item_in.quantity
                subtotal_acc += item_subtotal

                target_artisan_id = product.artisan_id or "artisan_demo_radha_1"

                image_snap = product.enhanced_image_url or product.image_url or ""
                order_items_to_create.append({
                    "product_id": product.id,
                    "product_title_snapshot": product.title,
                    "product_image_snapshot": image_snap,
                    "unit_price": unit_price,
                    "quantity": item_in.quantity,
                    "subtotal": item_subtotal,
                })

            delivery_fee = Decimal("0.00")  # Demo free delivery
            total_amount = subtotal_acc + delivery_fee

            # Create Order header
            new_order = Order(
                buyer_id=req.buyer_id or "buyer_demo_user",
                artisan_id=target_artisan_id or "artisan_demo_radha_1",
                status="PENDING",
                subtotal=subtotal_acc,
                delivery_charge=delivery_fee,
                total=total_amount,
                shipping_name=req.shipping_name,
                shipping_phone=req.shipping_phone,
                shipping_address=req.shipping_address,
                shipping_city=req.shipping_city,
                shipping_state=req.shipping_state,
                shipping_pincode=req.shipping_pincode,
            )
            db.add(new_order)
            db.flush()  # Populates new_order.id

            # Create Order Items with snapshots
            for item_dict in order_items_to_create:
                db_item = OrderItem(
                    order_id=new_order.id,
                    **item_dict
                )
                db.add(db_item)

            db.commit()
            db.refresh(new_order)

            return self._enrich_order_response(db, new_order)

        except HTTPException:
            db.rollback()
            raise
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Failed to create order: {str(e)}")

    def update_order_status(self, db: Session, order_id: str, new_status: str) -> OrderResponse:
        """
        Validates state transition against canonical order lifecycle,
        handles cancellation stock restoration, and updates order.
        """
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(status_code=404, detail=f"Order '{order_id}' not found.")

        current_status = (order.status or "").upper()
        target_status = new_status.upper()

        allowed_next = VALID_TRANSITIONS.get(current_status, [])
        if target_status not in allowed_next:
            raise HTTPException(
                status_code=400,
                detail=f"Illegal state transition from '{current_status}' to '{target_status}'. Allowed transitions: {allowed_next}"
            )

        # Handle cancellation stock restoration
        if target_status == "CANCELLED":
            self._restore_order_stock(db, order)

        order.status = target_status
        order.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(order)

        return self._enrich_order_response(db, order)

    def cancel_order(self, db: Session, order_id: str) -> OrderResponse:
        """Cancels an order if before dispatch and restores product stock atomically."""
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(status_code=404, detail=f"Order '{order_id}' not found.")

        if order.status in ["DISPATCHED", "DELIVERED", "COMPLETED"]:
            raise HTTPException(status_code=400, detail="Orders that have already been dispatched cannot be cancelled.")

        if order.status == "CANCELLED":
            return self._enrich_order_response(db, order)

        self._restore_order_stock(db, order)
        order.status = "CANCELLED"
        order.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(order)

        return self._enrich_order_response(db, order)

    def _restore_order_stock(self, db: Session, order: Order) -> None:
        """Internal helper to restore product inventory when an order is cancelled."""
        for item in order.items:
            prod = db.query(Product).filter(Product.id == item.product_id).first()
            if prod:
                prod.stock = (prod.stock or 0) + item.quantity
                if prod.status == "out_of_stock" and prod.stock > 0:
                    prod.status = "published"

    def list_orders(
        self,
        db: Session,
        buyer_id: Optional[str] = None,
        artisan_id: Optional[str] = None,
        status: Optional[str] = None,
    ) -> List[OrderResponse]:
        """Lists orders filtered by buyer, artisan, or status."""
        query = db.query(Order)
        if buyer_id and buyer_id != "all":
            query = query.filter(Order.buyer_id == buyer_id)
        if artisan_id and artisan_id != "all":
            query = query.filter(Order.artisan_id == artisan_id)
        if status and status.upper() != "ALL":
            query = query.filter(Order.status == status.upper())

        orders = query.order_by(Order.created_at.desc()).all()
        return [self._enrich_order_response(db, o) for o in orders]

    def get_order_by_id(self, db: Session, order_id: str) -> Optional[OrderResponse]:
        """Retrieves single order with complete details."""
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            return None
        return self._enrich_order_response(db, order)


order_service = OrderService()
