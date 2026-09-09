import requests

API_BASE = "http://127.0.0.1:8000/api/v1"

def test_pricing_endpoint():
    print("--- 1. Testing Jute Bag Pricing ---")
    r1 = requests.post(f"{API_BASE}/ai/pricing", json={
        "title": "हस्तनिर्मित जूट बैग",
        "category": "Bags & Accessories",
        "material": "प्राकृतिक जूट",
        "raw_material_cost": 180,
        "making_cost": 220,
    })
    print("Jute Bag (₹180 mat + ₹220 make):", r1.json())
    assert r1.status_code == 200
    d1 = r1.json()
    assert d1["suggested_price"] == 580.0 or d1["suggested_price"] == 600.0 or d1["suggested_price"] == 650.0

    print("\n--- 2. Testing Terracotta Vase Pricing ---")
    r2 = requests.post(f"{API_BASE}/ai/pricing", json={
        "title": "टेराकोटा फूलदान",
        "category": "Pottery",
        "material": "Terracotta",
        "raw_material_cost": 110,
        "making_cost": 190,
    })
    print("Terracotta Vase (₹110 mat + ₹190 make):", r2.json())
    assert r2.status_code == 200
    d2 = r2.json()
    assert d2["suggested_price"] != 850.0

    print("\n--- 3. Testing Brass Bangles Pricing ---")
    r3 = requests.post(f"{API_BASE}/ai/pricing", json={
        "title": "पीतल चूड़ियाँ",
        "category": "Jewellery",
        "material": "Brass",
        "raw_material_cost": 120,
        "making_cost": 140,
    })
    print("Brass Bangles (₹120 mat + ₹140 make):", r3.json())
    assert r3.status_code == 200
    d3 = r3.json()
    assert d3["suggested_price"] != 850.0
    assert d3["suggested_price"] != d1["suggested_price"]
    assert d3["suggested_price"] != d2["suggested_price"]

    print("\n--- 4. Testing Cost Sensitivity (Increased Labor) ---")
    r4 = requests.post(f"{API_BASE}/ai/pricing", json={
        "title": "हस्तनिर्मित जूट बैग",
        "category": "Bags & Accessories",
        "raw_material_cost": 250,
        "making_cost": 400,
    })
    d4 = r4.json()
    print("Jute Bag Higher Labor (₹250 mat + ₹400 make):", d4["suggested_price"], "profit:", d4["estimated_profit"])
    assert d4["suggested_price"] > d1["suggested_price"]

    print("\n--- 5. Testing Marketplace Products (No Universal ₹850) ---")
    rm = requests.get(f"{API_BASE}/marketplace/products")
    assert rm.status_code == 200
    m_prods = rm.json()
    prices = [p["price"] for p in m_prods]
    print(f"Marketplace product count: {len(m_prods)}")
    for p in m_prods:
        print(f"  - {p['title']}: ₹{p['price']}")
    
    # Verify not all prices are 850
    assert len(set(prices)) > 1, f"All prices were identical: {prices}"
    print("\n✅ All Pricing Verification Tests Passed Successfully!")

if __name__ == "__main__":
    test_pricing_endpoint()
