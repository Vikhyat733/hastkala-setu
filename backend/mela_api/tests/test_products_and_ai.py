from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_create_and_list_products():
    payload = {
        "title": "जयपुरी मिट्टी का फूलदान",
        "description_hindi": "हाथ से बना हुआ मिट्टी का फूलदान",
        "category": "Pottery",
        "material": "Clay",
        "price": 850.0,
        "stock": 3,
        "status": "published",
    }
    create_res = client.post("/api/v1/products/", json=payload)
    assert create_res.status_code in [200, 201]
    data = create_res.json()
    assert data["title"] == payload["title"]
    assert float(data["price"]) == 850.0
    product_id = data["id"]

    list_res = client.get("/api/v1/products/")
    assert list_res.status_code == 200
    items = list_res.json()
    assert any(item["id"] == product_id for item in items)

def test_ai_enhance_image():
    response = client.post("/api/v1/ai/enhance-image", json={
        "image_base64": "data:image/jpeg;base64,mock",
        "enhancement_level": "studio"
    })
    assert response.status_code == 200
    res = response.json()
    assert res["success"] is True
    assert "operations_applied" in res

def test_ai_transcribe():
    response = client.post("/api/v1/ai/transcribe", json={
        "language_hint": "hi"
    })
    assert response.status_code == 200
    assert response.json()["success"] is True
    assert "transcript" in response.json()

def test_ai_catalog():
    response = client.post("/api/v1/ai/catalog", json={
        "transcript": "यह हाथ से बना हुआ मिट्टी का फूलदान है।",
        "language": "hi"
    })
    assert response.status_code == 200
    data = response.json()
    assert "title" in data
    assert "category" in data
    assert "description_hindi" in data

def test_ai_pricing():
    response = client.post("/api/v1/ai/pricing", json={
        "category": "Pottery",
        "material": "Terracotta",
        "craft_type": "Pottery",
        "estimated_material_cost": 220,
        "estimated_making_cost": 260
    })
    assert response.status_code == 200
    data = response.json()
    assert data["suggested_price"] > 0
    assert data["estimated_profit"] > 0
