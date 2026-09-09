from app.core.database import SessionLocal
from app.models.product import Product

db = SessionLocal()
# Delete old test items with generic duplicate titles if created earlier
old_test_items = db.query(Product).filter(
    Product.id.not_in([
        "prod-seed-jute-1",
        "prod-seed-vase-2",
        "prod-seed-scarf-3",
        "prod-seed-box-4",
        "prod-seed-bangles-5"
    ])
).all()

print(f"Cleaning up {len(old_test_items)} legacy test products...")
for item in old_test_items:
    db.delete(item)
db.commit()
print("Cleaned database. Current products:")
for p in db.query(Product).all():
    print(f" - {p.id}: {p.title} (Rs. {p.price})")
db.close()
