"""Product & Catalog Service Layer"""
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate


class ProductService:
    """Manages product lifecycle, draft listings, inventory, and category mappings."""

    def list_products(self, db: Session, artisan_id: Optional[str] = None, skip: int = 0, limit: int = 50) -> List[Product]:
        query = db.query(Product)
        if artisan_id:
            query = query.filter(Product.artisan_id == artisan_id)
        return query.order_by(Product.created_at.desc()).offset(skip).limit(limit).all()

    def get_by_id(self, db: Session, product_id: str) -> Optional[Product]:
        return db.query(Product).filter(Product.id == product_id).first()

    def create_product(self, db: Session, data: ProductCreate) -> Product:
        product_dict = data.model_dump()
        product = Product(**product_dict)
        db.add(product)
        db.commit()
        db.refresh(product)
        return product

    def update_product(self, db: Session, product_id: str, data: ProductUpdate) -> Optional[Product]:
        product = self.get_by_id(db, product_id)
        if not product:
            return None

        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            if value is not None:
                setattr(product, key, value)

        db.commit()
        db.refresh(product)
        return product

    def publish_product(self, db: Session, product_id: str) -> Optional[Product]:
        product = self.get_by_id(db, product_id)
        if product:
            product.status = "published"
            db.commit()
            db.refresh(product)
        return product

    def delete_product(self, db: Session, product_id: str) -> bool:
        product = self.get_by_id(db, product_id)
        if product:
            db.delete(product)
            db.commit()
            return True
        return False


product_service = ProductService()
