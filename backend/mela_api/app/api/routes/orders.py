from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.schemas.order import OrderCreateRequest, OrderResponse, OrderStatusUpdateRequest
from app.services.orders.service import order_service

router = APIRouter()


@router.post("/", response_model=OrderResponse)
def create_order(req: OrderCreateRequest, db: Session = Depends(get_db)):
    """Create a new order with atomic stock reduction and purchase price snapshot."""
    return order_service.create_order(db, req)


@router.get("/", response_model=List[OrderResponse])
def list_orders(
    buyer_id: Optional[str] = Query(None, description="Filter by buyer ID"),
    artisan_id: Optional[str] = Query(None, description="Filter by artisan ID"),
    status: Optional[str] = Query(None, description="Filter by canonical status"),
    db: Session = Depends(get_db),
):
    """List orders with optional filtering by buyer, artisan, or status."""
    return order_service.list_orders(db, buyer_id=buyer_id, artisan_id=artisan_id, status=status)


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: str, db: Session = Depends(get_db)):
    """Retrieve single order details with item snapshots."""
    order = order_service.get_order_by_id(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail=f"Order '{order_id}' not found.")
    return order


@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: str,
    req: OrderStatusUpdateRequest,
    db: Session = Depends(get_db),
):
    """Validate state machine progression and transition order status."""
    return order_service.update_order_status(db, order_id, req.status)


@router.post("/{order_id}/cancel", response_model=OrderResponse)
def cancel_order(order_id: str, db: Session = Depends(get_db)):
    """Cancel an order before dispatch and restore product inventory."""
    return order_service.cancel_order(db, order_id)


@router.get("/artisan/{artisan_id}", response_model=List[OrderResponse])
def list_artisan_orders(
    artisan_id: str,
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """List orders belonging to a specific artisan."""
    return order_service.list_orders(db, artisan_id=artisan_id, status=status)
