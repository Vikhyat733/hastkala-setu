from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.services.products import product_service

router = APIRouter()


@router.get("", response_model=List[ProductResponse])
@router.get("/", response_model=List[ProductResponse])
def list_products(
    artisan_id: Optional[str] = Query(None, description="Filter products by artisan ID"),
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    return product_service.list_products(db, artisan_id=artisan_id, skip=skip, limit=limit)


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product_in: ProductCreate, db: Session = Depends(get_db)):
    return product_service.create_product(db, product_in)


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: str, db: Session = Depends(get_db)):
    product = product_service.get_by_id(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.patch("/{product_id}", response_model=ProductResponse)
@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: str,
    product_in: ProductUpdate,
    db: Session = Depends(get_db)
):
    """Update product fields and preserve manual artisan edits."""
    updated = product_service.update_product(db, product_id, product_in)
    if not updated:
        raise HTTPException(status_code=404, detail="Product not found")
    return updated


@router.post("/{product_id}/publish", response_model=ProductResponse)
def publish_product(product_id: str, db: Session = Depends(get_db)):
    product = product_service.publish_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: str, db: Session = Depends(get_db)):
    success = product_service.delete_product(db, product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return None
