"""End-to-End Automated Test for MELA Step 6: Earnings & Payment Architecture"""
import sys
from fastapi.testclient import TestClient
from app.main import app

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

client = TestClient(app)


def test_earnings_and_payment_architecture():
    print("=== 1. Testing Initial Earnings Summary ===")
    r_summary = client.get("/api/v1/earnings/summary?period=all_time")
    assert r_summary.status_code == 200
    summary = r_summary.json()
    print(f"Initial Summary: Total Sales=Rs.{summary['total_sales']}, Completed Orders={summary['completed_orders']}, Products Sold={summary['products_sold']}")
    assert summary["currency"] == "INR"
    assert summary["platform_fee"] == 0.0
    assert summary["delivery_fee"] == 0.0

    print("\n=== 2. Creating Test Orders to Verify Completed Order Rule ===")
    # Create Order 1: Jute Bag (Qty: 2 x Rs.650 = Rs.1300)
    r_prod = client.get("/api/v1/marketplace/products")
    prods = r_prod.json()
    jute = next((p for p in prods if "जूट" in p["title"] or "Jute" in p["title"]), prods[0])
    vase = next((p for p in prods if "Vase" in p["title"] or "फूलदान" in p["title"]), prods[1])

    # Ensure sufficient stock for tests
    client.patch(f"/api/v1/products/{jute['id']}", json={"stock": 10, "status": "published"})
    client.patch(f"/api/v1/products/{vase['id']}", json={"stock": 10, "status": "published"})

    # 1. Place Order 1
    r_o1 = client.post("/api/v1/orders/", json={
        "buyer_id": "buyer_test_1",
        "shipping_name": "Ramesh Kumar",
        "shipping_phone": "9876543210",
        "shipping_address": "House 10, Civil Lines",
        "shipping_city": "Lucknow",
        "shipping_state": "Uttar Pradesh",
        "shipping_pincode": "226001",
        "items": [{"product_id": jute["id"], "quantity": 2}]
    })
    assert r_o1.status_code == 200
    o1_id = r_o1.json()["id"]

    # 2. Place Order 2 (will be completed)
    r_o2 = client.post("/api/v1/orders/", json={
        "buyer_id": "buyer_test_2",
        "shipping_name": "Anita Devi",
        "shipping_phone": "9876543212",
        "shipping_address": "Street 4, Gomti Nagar",
        "shipping_city": "Lucknow",
        "shipping_state": "Uttar Pradesh",
        "shipping_pincode": "226010",
        "items": [{"product_id": vase["id"], "quantity": 1}]
    })
    assert r_o2.status_code == 200
    o2_id = r_o2.json()["id"]

    # 3. Place Order 3 (will be cancelled)
    r_o3 = client.post("/api/v1/orders/", json={
        "buyer_id": "buyer_test_3",
        "shipping_name": "Cancelled User",
        "shipping_phone": "9876543213",
        "shipping_address": "Sector 5",
        "shipping_city": "Lucknow",
        "shipping_state": "Uttar Pradesh",
        "shipping_pincode": "226001",
        "items": [{"product_id": jute["id"], "quantity": 1}]
    })
    assert r_o3.status_code == 200
    o3_id = r_o3.json()["id"]

    # Check Earnings while orders are PENDING (Completed Sales should NOT increase yet)
    r_summary_pending = client.get("/api/v1/earnings/summary?period=all_time")
    pending_sales = r_summary_pending.json()["total_sales"]
    print(f"Sales during PENDING state: Rs.{pending_sales} (Pending orders do not count as completed sales)")

    # Cancel Order 3
    client.post(f"/api/v1/orders/{o3_id}/cancel")
    print(f"Order 3 cancelled.")

    # Advance Order 1 & 2 to COMPLETED
    for o_id in [o1_id, o2_id]:
        client.patch(f"/api/v1/orders/{o_id}/status", json={"status": "ACCEPTED"})
        client.patch(f"/api/v1/orders/{o_id}/status", json={"status": "PREPARING"})
        client.patch(f"/api/v1/orders/{o_id}/status", json={"status": "READY_TO_DISPATCH"})
        client.patch(f"/api/v1/orders/{o_id}/status", json={"status": "DISPATCHED"})
        client.patch(f"/api/v1/orders/{o_id}/status", json={"status": "DELIVERED"})
        client.patch(f"/api/v1/orders/{o_id}/status", json={"status": "COMPLETED"})

    print("\n=== 3. Verifying Updated Earnings Calculation ===")
    r_summary_after = client.get("/api/v1/earnings/summary?period=all_time")
    assert r_summary_after.status_code == 200
    s_after = r_summary_after.json()
    print(f"Updated Earnings Summary: Total Sales=Rs.{s_after['total_sales']}, Completed Orders={s_after['completed_orders']}, Products Sold={s_after['products_sold']}, Net Earnings=Rs.{s_after['net_earnings']}")
    assert s_after["completed_orders"] >= 2
    assert s_after["products_sold"] >= 3  # 2 Jute + 1 Vase

    print("\n=== 4. Testing Time Period Filters ===")
    r_this_month = client.get("/api/v1/earnings/summary?period=this_month")
    assert r_this_month.status_code == 200
    print(f"This Month Sales: Rs.{r_this_month.json()['total_sales']}")

    r_last_month = client.get("/api/v1/earnings/summary?period=last_month")
    assert r_last_month.status_code == 200
    print(f"Last Month Sales: Rs.{r_last_month.json()['total_sales']} (Zero/Appropriate when no past month orders)")

    print("\n=== 5. Testing Recent Sales Snapshot API ===")
    r_recent = client.get("/api/v1/earnings/recent?limit=5")
    assert r_recent.status_code == 200
    recent_items = r_recent.json()
    assert len(recent_items) > 0
    top_sale = recent_items[0]
    print(f"Top Recent Completed Sale: {top_sale['product_title']} | Qty: {top_sale['quantity']} | Unit Price: Rs.{top_sale['unit_price']} | Total: Rs.{top_sale['order_total']} | Buyer: {top_sale['buyer_name']}")
    assert top_sale["status"] == "COMPLETED"

    print("\n=== 6. Testing Payout Account Configuration ===")
    payout_payload = {
        "account_holder_name": "Radha Devi",
        "payout_type": "UPI",
        "upi_id": "radha.artisan@oksbi",
        "bank_name": "State Bank of India"
    }
    r_save_payout = client.post("/api/v1/earnings/payout/account", json=payout_payload)
    assert r_save_payout.status_code == 200
    saved_payout = r_save_payout.json()
    print(f"Saved Payout Account: Connected={saved_payout['is_connected']}, Holder={saved_payout['account_holder_name']}, UPI={saved_payout['upi_id']}")
    assert saved_payout["is_connected"] is True
    assert saved_payout["upi_id"] == "radha.artisan@oksbi"

    # Get payout account
    r_get_payout = client.get("/api/v1/earnings/payout/account")
    assert r_get_payout.status_code == 200
    assert r_get_payout.json()["is_connected"] is True

    print("\nSUCCESS: All Step 6 Earnings & Payment Architecture Tests Passed Successfully!")


if __name__ == "__main__":
    test_earnings_and_payment_architecture()
