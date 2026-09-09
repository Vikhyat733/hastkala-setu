import sys
from fastapi.testclient import TestClient
from app.main import app

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

client = TestClient(app)

def test_complete_order_system():
    print("=== 1. Checking Product Initial Stock & Price ===")
    r_prod = client.get("/api/v1/marketplace/products")
    assert r_prod.status_code == 200
    prods = r_prod.json()
    jute_prod = next((p for p in prods if p["id"] == "prod-seed-jute-1"), prods[0])
    initial_stock = jute_prod["stock"]
    initial_price = float(jute_prod["price"])
    print(f"Target Product: ID={jute_prod['id']}, Title={jute_prod['title']}, Stock={initial_stock}, Price=Rs.{initial_price}")

    print("\n=== 2. Creating Buyer Order (Qty: 2) ===")
    order_payload = {
        "buyer_id": "buyer_priya_101",
        "shipping_name": "Priya Sharma",
        "shipping_phone": "9876543210",
        "shipping_address": "12, Shanti Nagar, Tonk Road",
        "shipping_city": "Jaipur",
        "shipping_state": "Rajasthan",
        "shipping_pincode": "302015",
        "items": [
            {
                "product_id": jute_prod["id"],
                "quantity": 2
            }
        ]
    }
    r_order = client.post("/api/v1/orders/", json=order_payload)
    if r_order.status_code != 200:
        print("Order creation error:", r_order.status_code, r_order.json())
    assert r_order.status_code == 200
    order_data = r_order.json()
    order_id = order_data["id"]
    print(f"Order Created: ID={order_id}, Status={order_data['status']}, Total=Rs.{order_data['total']}")
    assert order_data["status"] == "PENDING"
    assert float(order_data["subtotal"]) == initial_price * 2
    assert float(order_data["total"]) == initial_price * 2
    assert len(order_data["items"]) == 1
    assert order_data["items"][0]["quantity"] == 2
    assert float(order_data["items"][0]["unit_price"]) == initial_price

    print("\n=== 3. Verifying Stock Decrement in Marketplace ===")
    r_prod_after = client.get(f"/api/v1/marketplace/products/{jute_prod['id']}")
    assert r_prod_after.status_code == 200
    updated_jute = r_prod_after.json()
    print(f"Updated Stock: {updated_jute['stock']} (Decreased from {initial_stock} by 2)")
    assert updated_jute["stock"] == initial_stock - 2

    print("\n=== 4. Testing Canonical Lifecycle Transitions ===")
    # Step 1: PENDING -> ACCEPTED
    r_accept = client.patch(f"/api/v1/orders/{order_id}/status", json={"status": "ACCEPTED"})
    assert r_accept.status_code == 200
    assert r_accept.json()["status"] == "ACCEPTED"
    print("State transition: PENDING -> ACCEPTED (OK)")

    # Step 2: ACCEPTED -> PREPARING
    r_prep = client.patch(f"/api/v1/orders/{order_id}/status", json={"status": "PREPARING"})
    assert r_prep.status_code == 200
    assert r_prep.json()["status"] == "PREPARING"
    print("State transition: ACCEPTED -> PREPARING (OK)")

    # Step 3: PREPARING -> READY_TO_DISPATCH
    r_ready = client.patch(f"/api/v1/orders/{order_id}/status", json={"status": "READY_TO_DISPATCH"})
    assert r_ready.status_code == 200
    assert r_ready.json()["status"] == "READY_TO_DISPATCH"
    print("State transition: PREPARING -> READY_TO_DISPATCH (OK)")

    # Step 4: READY_TO_DISPATCH -> DISPATCHED
    r_disp = client.patch(f"/api/v1/orders/{order_id}/status", json={"status": "DISPATCHED"})
    assert r_disp.status_code == 200
    assert r_disp.json()["status"] == "DISPATCHED"
    print("State transition: READY_TO_DISPATCH -> DISPATCHED (OK)")

    # Step 5: DISPATCHED -> DELIVERED
    r_deliv = client.patch(f"/api/v1/orders/{order_id}/status", json={"status": "DELIVERED"})
    assert r_deliv.status_code == 200
    assert r_deliv.json()["status"] == "DELIVERED"
    print("State transition: DISPATCHED -> DELIVERED (OK)")

    # Step 6: DELIVERED -> COMPLETED
    r_comp = client.patch(f"/api/v1/orders/{order_id}/status", json={"status": "COMPLETED"})
    assert r_comp.status_code == 200
    assert r_comp.json()["status"] == "COMPLETED"
    print("State transition: DELIVERED -> COMPLETED (OK)")

    # Illegal transition test (COMPLETED -> PREPARING should fail 400)
    r_bad = client.patch(f"/api/v1/orders/{order_id}/status", json={"status": "PREPARING"})
    assert r_bad.status_code == 400
    print("Illegal transition rejected with 400 (OK)")

    print("\n=== 5. Testing Order Cancellation & Stock Restoration ===")
    vase_prod = next(p for p in prods if p["id"] == "prod-seed-vase-2")
    vase_stock_before = vase_prod["stock"]
    r_vase_order = client.post("/api/v1/orders/", json={
        "buyer_id": "buyer_amit_102",
        "shipping_name": "Amit Patel",
        "shipping_phone": "9876543211",
        "shipping_address": "44, Navrangpura",
        "shipping_city": "Ahmedabad",
        "shipping_state": "Gujarat",
        "shipping_pincode": "380009",
        "items": [{"product_id": vase_prod["id"], "quantity": 1}]
    })
    assert r_vase_order.status_code == 200
    cancel_target_id = r_vase_order.json()["id"]

    # Cancel order
    r_cancel = client.post(f"/api/v1/orders/{cancel_target_id}/cancel")
    assert r_cancel.status_code == 200
    assert r_cancel.json()["status"] == "CANCELLED"
    print("Order Cancelled successfully.")

    # Verify stock restored
    r_vase_restored = client.get(f"/api/v1/marketplace/products/{vase_prod['id']}")
    assert r_vase_restored.json()["stock"] == vase_stock_before
    print(f"Stock restored to {vase_stock_before} after cancellation (OK)")

    print("\n=== 6. Testing Purchase Price Snapshot Immutability ===")
    # Update product price in database
    client.patch(f"/api/v1/products/{jute_prod['id']}", json={"price": 890.0})
    
    # Check old order #1
    r_old_order = client.get(f"/api/v1/orders/{order_id}")
    assert r_old_order.status_code == 200
    old_order_item = r_old_order.json()["items"][0]
    print(f"Current Product Price in DB: Rs.890.00 | Snapshot in Old Order: Rs.{old_order_item['unit_price']}")
    assert float(old_order_item["unit_price"]) == initial_price
    assert float(r_old_order.json()["total"]) == initial_price * 2
    print("Price snapshot verified: historical orders retain purchase-time price (OK)")

    # Reset product price back to original
    client.patch(f"/api/v1/products/{jute_prod['id']}", json={"price": initial_price})

    print("\nSUCCESS: All Complete Order System End-to-End Tests Passed Successfully!")

if __name__ == "__main__":
    test_complete_order_system()
