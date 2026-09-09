import sys
from fastapi.testclient import TestClient
from app.main import app

# Set utf-8 encoding for stdout
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

client = TestClient(app)

def test_all_pricing():
    print("--- 1. Testing Jute Bag Pricing ---")
    r1 = client.post("/api/v1/ai/pricing", json={
        "title": "हस्तनिर्मित जूट बैग",
        "category": "Bags & Accessories",
        "material": "प्राकृतिक जूट",
        "raw_material_cost": 180,
        "making_cost": 220,
    })
    d1 = r1.json()
    print("Jute Bag (Rs. 180 mat + Rs. 220 make) -> Suggested:", d1["suggested_price"], "profit:", d1["estimated_profit"])
    assert r1.status_code == 200
    assert d1["suggested_price"] == 580.0

    print("\n--- 2. Testing Terracotta Vase Pricing ---")
    r2 = client.post("/api/v1/ai/pricing", json={
        "title": "टेराकोटा फूलदान",
        "category": "Pottery",
        "material": "Terracotta",
        "raw_material_cost": 110,
        "making_cost": 190,
    })
    d2 = r2.json()
    print("Terracotta Vase (Rs. 110 mat + Rs. 190 make) -> Suggested:", d2["suggested_price"], "profit:", d2["estimated_profit"])
    assert r2.status_code == 200
    assert d2["suggested_price"] == 440.0
    assert d2["suggested_price"] != 850.0

    print("\n--- 3. Testing Brass Bangles Pricing ---")
    r3 = client.post("/api/v1/ai/pricing", json={
        "title": "पीतल चूड़ियाँ",
        "category": "Jewellery",
        "material": "Brass",
        "raw_material_cost": 120,
        "making_cost": 140,
    })
    d3 = r3.json()
    print("Brass Bangles (Rs. 120 mat + Rs. 140 make) -> Suggested:", d3["suggested_price"], "profit:", d3["estimated_profit"])
    assert r3.status_code == 200
    assert d3["suggested_price"] == 390.0
    assert d3["suggested_price"] != 850.0
    assert d3["suggested_price"] != d1["suggested_price"]
    assert d3["suggested_price"] != d2["suggested_price"]

    print("\n--- 4. Testing Cost Sensitivity (Increased Labor) ---")
    r4 = client.post("/api/v1/ai/pricing", json={
        "title": "हस्तनिर्मित जूट बैग",
        "category": "Bags & Accessories",
        "raw_material_cost": 250,
        "making_cost": 400,
    })
    d4 = r4.json()
    print("Jute Bag Higher Labor (Rs. 250 mat + Rs. 400 make) -> Suggested:", d4["suggested_price"], "profit:", d4["estimated_profit"])
    assert d4["suggested_price"] == 940.0
    assert d4["suggested_price"] > d1["suggested_price"]

    print("\n--- 5. Testing Marketplace Products (No Universal Rs. 850) ---")
    rm = client.get("/api/v1/marketplace/products")
    assert rm.status_code == 200
    m_prods = rm.json()
    prices = [p["price"] for p in m_prods]
    print(f"Marketplace product count: {len(m_prods)}")
    for p in m_prods:
        print(f"  - {p['title']}: Rs. {p['price']}")
    
    # Verify prices are distinct and not all 850
    assert len(set(prices)) > 1, f"All prices were identical: {prices}"
    print("\nSUCCESS: All Pricing In-Process Tests Passed Successfully!")

if __name__ == "__main__":
    test_all_pricing()
