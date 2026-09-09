import sqlite3

conn = sqlite3.connect("mela_dev.db")
cursor = conn.cursor()

# Drop legacy orders table if it lacks the new schema columns
cursor.execute("DROP TABLE IF EXISTS order_items;")
cursor.execute("DROP TABLE IF EXISTS orders;")

cursor.execute("""
CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY,
    buyer_id VARCHAR(36) NOT NULL,
    artisan_id VARCHAR(36) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    delivery_charge NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    shipping_name VARCHAR(255) NOT NULL,
    shipping_phone VARCHAR(20) NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_state VARCHAR(100) NOT NULL,
    shipping_pincode VARCHAR(10) NOT NULL,
    created_at DATETIME,
    updated_at DATETIME
);
""")

cursor.execute("""
CREATE TABLE order_items (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    product_title_snapshot VARCHAR(255) NOT NULL,
    product_image_snapshot TEXT,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    subtotal NUMERIC(10, 2) NOT NULL,
    FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
);
""")

conn.commit()
print("Orders and OrderItems tables migrated and created successfully in SQLite.")
conn.close()
