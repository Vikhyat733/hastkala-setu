from app.core.database import Base, engine
from app.models.artisan import Artisan
from app.models.product import Product
from app.models.order import Order, OrderItem
import sqlite3

# Create tables
Base.metadata.create_all(bind=engine)
print("Database tables initialized successfully.")

# Verify SQLite columns
conn = sqlite3.connect("mela_dev.db")
cursor = conn.cursor()
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = [row[0] for row in cursor.fetchall()]
print("Tables in SQLite DB:", tables)
conn.close()
