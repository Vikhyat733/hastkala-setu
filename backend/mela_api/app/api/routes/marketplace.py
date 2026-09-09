from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.schemas.product import MarketplaceProductResponse, CategoryItem
from app.services.marketplace.service import marketplace_service

router = APIRouter()


@router.get("/products", response_model=List[MarketplaceProductResponse])
@router.get("/products/", response_model=List[MarketplaceProductResponse])
def list_marketplace_products(
    category: Optional[str] = Query(None, description="Category filter (e.g. pottery, bags, textiles, woodcraft)"),
    search: Optional[str] = Query(None, description="Search term for title, material, category, craft type"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List public published products with category filtering and keyword search."""
    return marketplace_service.list_products(
        db,
        category=category,
        search=search,
        skip=skip,
        limit=limit,
    )


@router.get("/products/{product_id}", response_model=MarketplaceProductResponse)
def get_marketplace_product_detail(
    product_id: str,
    db: Session = Depends(get_db),
):
    """Get rich marketplace product details including artisan profile preview."""
    product = marketplace_service.get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found in marketplace")
    return product


@router.get("/categories", response_model=List[CategoryItem])
@router.get("/categories/", response_model=List[CategoryItem])
def list_marketplace_categories(
    db: Session = Depends(get_db),
):
    """List visual craft categories with dynamic product counts."""
    return marketplace_service.list_categories(db)
