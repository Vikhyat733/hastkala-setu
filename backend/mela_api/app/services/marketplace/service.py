"""Marketplace Service Layer

Handles public product discovery, category filtering, keyword search,
artisan profile enrichment, and seed data initialization for SIH demonstrations.
"""
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import or_
from decimal import Decimal

from app.models.product import Product
from app.models.artisan import Artisan
from app.schemas.product import MarketplaceProductResponse, CategoryItem


# Curated Category Definitions
CATEGORIES_METADATA = [
    {"id": "textiles", "name_hindi": "वस्त्र व हथकरघा", "name_english": "Textiles & Handloom", "icon": "🧵", "keywords": ["वस्त्र", "textile", "saree", "साड़ी", "shawl", "शॉल", "dupatta", "दुपट्टा", "handloom", "cotton", "silk"]},
    {"id": "pottery", "name_hindi": "मिट्टी के बर्तन व सजावट", "name_english": "Pottery & Earthenware", "icon": "🏺", "keywords": ["मिट्टी", "pottery", "vase", "फूलदान", "terracotta", "diya", "दीया", "kulhad", "कुल्हड़", "clay"]},
    {"id": "bags", "name_hindi": "बैग और एक्सेसरीज़", "name_english": "Bags & Accessories", "icon": "👜", "keywords": ["बैग", "bag", "जूट", "jute", "थैला", "पर्स", "purse", "clutch", "pouch"]},
    {"id": "jewellery", "name_hindi": "आभूषण व गहने", "name_english": "Jewellery & Ornaments", "icon": "💍", "keywords": ["गहने", "jewellery", "jewelry", "झुमका", "हार", "necklace", "bangle", "earring"]},
    {"id": "woodcraft", "name_hindi": "काष्ठ कला व गृह सज्जा", "name_english": "Woodcraft & Carvings", "icon": "🪵", "keywords": ["लकड़ी", "wood", "काष्ठ", "wooden", "शीशम", "carving"]},
    {"id": "art", "name_hindi": "कला व पेंटिंग", "name_english": "Art & Folk Paintings", "icon": "🎨", "keywords": ["कला", "art", "painting", "पेंटिंग", "चित्रकारी", "madhubani", "warli"]},
    {"id": "home", "name_hindi": "गृह सज्जा व जीवनशैली", "name_english": "Home & Lifestyle", "icon": "🧺", "keywords": ["गृह", "home", "टोकरी", "basket", "bamboo", "बाँस", "lifestyle", "decor"]},
    {"id": "natural", "name_hindi": "प्राकृतिक उत्पाद", "name_english": "Natural & Organic", "icon": "🌿", "keywords": ["प्राकृतिक", "natural", "organic", "herb", "जैविक", "eco"]},
]

DEFAULT_ARTISANS = [
    {
        "id": "artisan_demo_radha_1",
        "name": "राधा देवी (Radha Devi)",
        "phone": "9876543210",
        "state": "राजस्थान (Rajasthan)",
        "district": "जयपुर (Jaipur)",
        "craft_category": "जूट शिल्प व टेराकोटा (Jute Craft & Terracotta)",
        "is_verified": True,
        "bio": "राधा जी जयपुर की एक अनुभवी शिल्पकार हैं जो पिछले 15 वर्षों से प्राकृतिक जूट और मिट्टी की कलाकृतियाँ तैयार कर रही हैं।",
    },
    {
        "id": "artisan_demo_ramesh_2",
        "name": "रमेश प्रजापति (Ramesh Prajapati)",
        "phone": "9876543211",
        "state": "राजस्थान (Rajasthan)",
        "district": "जयपुर (Jaipur)",
        "craft_category": "पारंपरिक चाक मिट्टी कला (Jaipur Wheel Pottery)",
        "is_verified": True,
        "bio": "रमेश जी 3 पीढ़ियों से पारंपरिक कुम्हार कला को जीवित रखे हुए हैं। वे केवल जैविक रंगों और स्थानीय मिट्टी का उपयोग करते हैं।",
    },
    {
        "id": "artisan_demo_sunita_3",
        "name": "सुनीता बाई (Sunita Bai)",
        "phone": "9876543212",
        "state": "गुजरात (Gujarat)",
        "district": "कच्छ (Kutch)",
        "craft_category": "कच्छी हथकरघा कढ़ाई (Kutch Handloom Embroidery)",
        "is_verified": True,
        "bio": "सुनीता जी कच्छ की सुफ और अजरक कढ़ाई की विशेषज्ञ हैं, जो ग्रामीण महिला स्वयं सहायता समूह का नेतृत्व करती हैं।",
    },
    {
        "id": "artisan_demo_mohan_4",
        "name": "मोहन लाल (Mohan Lal)",
        "phone": "9876543213",
        "state": "उत्तर प्रदेश (Uttar Pradesh)",
        "district": "सहारनपुर (Saharanpur)",
        "craft_category": "शीशम काष्ठ नक्काशी (Saharanpur Wood Carving)",
        "is_verified": True,
        "bio": "सहारनपुर की प्रसिद्ध काष्ठ कला के सिद्धहस्त कारीगर, जो बारीक नक्काशी और पीतल की जड़ाई में पारंगत हैं।",
    }
]

DEFAULT_SEED_PRODUCTS = [
    {
        "id": "prod-seed-jute-1",
        "artisan_id": "artisan_demo_radha_1",
        "title": "हस्तनिर्मित जूट बैग (Handcrafted Jute Bag)",
        "description": "100% पर्यावरण-अनुकूल प्राकृतिक जूट बैग। इसमें सूती कपड़े की अंदरूनी लाइनिंग और मजबूत हैंडल लगे हैं।",
        "description_hindi": "यह जूट से बना हुआ हाथ का बैग है। इसे हाथ से बनाया गया है और इसमें कपड़े की मजबूत अंदरूनी लाइनिंग है।",
        "description_english": "Handcrafted eco-friendly natural jute bag with durable cotton cloth inner lining and strong shoulder handles.",
        "category": "बैग और एक्सेसरीज़ / Bags & Accessories",
        "material": "प्राकृतिक जूट (सूती कपड़े की अंदरूनी लाइनिंग सहित)",
        "craft_type": "हस्तनिर्मित जूट शिल्प / Handcrafted Jute Weaving",
        "price": Decimal("650.00"),
        "estimated_material_cost": Decimal("180.00"),
        "estimated_making_cost": Decimal("220.00"),
        "stock": 8,
        "status": "published",
        "image_url": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600",
        "enhanced_image_url": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600",
    },
    {
        "id": "prod-seed-vase-2",
        "artisan_id": "artisan_demo_ramesh_2",
        "title": "टेराकोटा नक्काशीदार फूलदान (Terracotta Vase)",
        "description": "चाक पर हाथ से तराशा गया पारंपरिक टेराकोटा फूलदान। प्राकृतिक रंगों और जयपुरी मिट्टी से निर्मित।",
        "description_hindi": "यह सुंदर हस्तनिर्मित टेराकोटा फूलदान प्राकृतिक लाल मिट्टी से चाक पर बनाया गया है।",
        "description_english": "Handcrafted terracotta vase made on traditional potter wheels in Jaipur with 100% organic earth clay.",
        "category": "मिट्टी के बर्तन और सजावट / Pottery & Decor",
        "material": "प्राकृतिक लाल मिट्टी (Natural Terracotta Clay)",
        "craft_type": "चाक पर तराशी हस्तकला (Hand-turned Pottery)",
        "price": Decimal("450.00"),
        "estimated_material_cost": Decimal("110.00"),
        "estimated_making_cost": Decimal("190.00"),
        "stock": 5,
        "status": "published",
        "image_url": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600",
        "enhanced_image_url": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600",
    },
    {
        "id": "prod-seed-scarf-3",
        "artisan_id": "artisan_demo_sunita_3",
        "title": "हाथ की कढ़ाई वाला सूती दुपट्टा (Embroidered Cotton Scarf)",
        "description": "कच्छ की पारंपरिक अजरक और सुफ कढ़ाई से अलंकृत 100% शुद्ध सूती दुपट्टा।",
        "description_hindi": "हाथ की बारीक सुफ कढ़ाई से अलंकृत पारंपरिक सूती दुपट्टा।",
        "description_english": "Exquisite hand-embroidered pure cotton scarf crafted with traditional Kutch artisans' heritage needlework.",
        "category": "वस्त्र और हथकरघा / Handloom & Textiles",
        "material": "100% शुद्ध हथकरघा सूती (Pure Handloom Cotton)",
        "craft_type": "कच्छी हस्त कढ़ाई (Kutch Heritage Embroidery)",
        "price": Decimal("1200.00"),
        "estimated_material_cost": Decimal("350.00"),
        "estimated_making_cost": Decimal("450.00"),
        "stock": 4,
        "status": "published",
        "image_url": "https://images.unsplash.com/photo-1605007493699-af65834f8a00?auto=format&fit=crop&q=80&w=600",
        "enhanced_image_url": "https://images.unsplash.com/photo-1605007493699-af65834f8a00?auto=format&fit=crop&q=80&w=600",
    },
    {
        "id": "prod-seed-box-4",
        "artisan_id": "artisan_demo_mohan_4",
        "title": "शीशम काष्ठ नक्काशीदार आभूषण डिब्बा (Carved Wooden Jewelry Box)",
        "description": "सहारनपुर की ठोस शीशम की लकड़ी पर बारीक हाथ की नक्काशी और पीतल के कब्जों से तैयार कलात्मक डिब्बा।",
        "description_hindi": "सहारनपुर की ठोस शीशम की लकड़ी पर हाथ की नक्काशी से बना कलात्मक आभूषण डिब्बा।",
        "description_english": "Artisan hand-carved solid Sheesham wood jewelry organizer box with brass hinges.",
        "category": "काष्ठ कला और गृह सज्जा / Woodcraft & Decor",
        "material": "प्राकृतिक शीशम की लकड़ी (Solid Sheesham Wood)",
        "craft_type": "हाथ की नक्काशी (Hand Wood Carving)",
        "price": Decimal("950.00"),
        "estimated_material_cost": Decimal("280.00"),
        "estimated_making_cost": Decimal("320.00"),
        "stock": 6,
        "status": "published",
        "image_url": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=600",
        "enhanced_image_url": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=600",
    },
    {
        "id": "prod-seed-bangles-5",
        "artisan_id": "artisan_demo_radha_1",
        "title": "हस्तनिर्मित पीतल चूड़ियाँ (Handcrafted Brass Bangles Set)",
        "description": "पारंपरिक जयपुरी मीनाकारी और पीतल से निर्मित कलात्मक चूड़ियों का सेट।",
        "description_hindi": "पारंपरिक जयपुरी मीनाकारी और शुद्ध पीतल से निर्मित कलात्मक चूड़ियाँ।",
        "description_english": "Artisan handcrafted traditional Jaipur Meenakari brass bangles set.",
        "category": "आभूषण और गहने / Jewellery & Ornaments",
        "material": "शुद्ध पीतल व मीनाकारी (Pure Brass & Enamel)",
        "craft_type": "पारंपरिक मीनाकारी (Traditional Meenakari Craft)",
        "price": Decimal("380.00"),
        "estimated_material_cost": Decimal("120.00"),
        "estimated_making_cost": Decimal("140.00"),
        "stock": 10,
        "status": "published",
        "image_url": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600",
        "enhanced_image_url": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600",
    },
]



class MarketplaceService:
    """Provides product retrieval, category browsing, search, and artisan data enrichment."""

    def seed_initial_data(self, db: Session) -> None:
        """Seed initial artisan profiles and demo products if database is empty."""
        try:
            # Seed Artisans
            for art_data in DEFAULT_ARTISANS:
                existing_art = db.query(Artisan).filter(Artisan.id == art_data["id"]).first()
                if not existing_art:
                    db.add(Artisan(**art_data))

            db.commit()

            # Seed or sync default demo products
            for prod_data in DEFAULT_SEED_PRODUCTS:
                existing_prod = db.query(Product).filter(Product.id == prod_data["id"]).first()
                if not existing_prod:
                    db.add(Product(**prod_data))
                else:
                    # Update seed product pricing & costs to keep demo data consistent
                    existing_prod.price = prod_data["price"]
                    existing_prod.estimated_material_cost = prod_data["estimated_material_cost"]
                    existing_prod.estimated_making_cost = prod_data["estimated_making_cost"]
            db.commit()
        except Exception as e:
            db.rollback()
            # If tables already initialized, gracefully continue


    def list_products(
        self,
        db: Session,
        category: Optional[str] = None,
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> List[MarketplaceProductResponse]:
        """
        Fetch published products with category filtering and keyword search.
        ONLY returns products where status == 'published'.
        """
        # Ensure seed data exists
        self.seed_initial_data(db)

        query = db.query(Product).filter(Product.status == "published")

        # Category Filter
        if category and category.lower() != "all":
            cat_lower = category.lower()
            # Match against category keywords or category title
            matched_meta = next((c for c in CATEGORIES_METADATA if c["id"] == cat_lower or cat_lower in c["name_english"].lower() or cat_lower in c["name_hindi"].lower()), None)
            if matched_meta:
                cat_conditions = [Product.category.ilike(f"%{kw}%") for kw in matched_meta["keywords"]]
                query = query.filter(or_(*cat_conditions))
            else:
                query = query.filter(Product.category.ilike(f"%{category}%"))

        # Keyword Search
        if search and search.strip():
            s = f"%{search.strip().lower()}%"
            query = query.filter(
                or_(
                    Product.title.ilike(s),
                    Product.description.ilike(s),
                    Product.description_hindi.ilike(s),
                    Product.description_english.ilike(s),
                    Product.category.ilike(s),
                    Product.material.ilike(s),
                    Product.craft_type.ilike(s),
                )
            )

        products = query.order_by(Product.created_at.desc()).offset(skip).limit(limit).all()

        # Enrich with artisan data
        results: List[MarketplaceProductResponse] = []
        for p in products:
            artisan = db.query(Artisan).filter(Artisan.id == p.artisan_id).first()
            artisan_name = artisan.name if artisan else "राधा देवी (Radha Devi)"
            artisan_location = f"{artisan.district or 'जयपुर'}, {artisan.state or 'राजस्थान'}" if artisan else "जयपुर, राजस्थान"
            artisan_craft = artisan.craft_category if artisan else "पारंपरिक हस्तशिल्प"
            artisan_bio = artisan.bio if artisan else None
            artisan_verified = artisan.is_verified if artisan else True

            results.append(
                MarketplaceProductResponse(
                    id=p.id,
                    artisan_id=p.artisan_id,
                    title=p.title,
                    description=p.description,
                    description_hindi=p.description_hindi,
                    description_english=p.description_english,
                    category=p.category,
                    material=p.material,
                    craft_type=p.craft_type,
                    image_url=p.image_url,
                    enhanced_image_url=p.enhanced_image_url,
                    price=p.price,
                    estimated_material_cost=p.estimated_material_cost,
                    estimated_making_cost=p.estimated_making_cost,
                    stock=p.stock or 1,
                    status=p.status or "published",
                    artisan_name=artisan_name,
                    artisan_location=artisan_location,
                    artisan_craft=artisan_craft,
                    artisan_verified=artisan_verified,
                    artisan_bio=artisan_bio,
                    created_at=p.created_at,
                    updated_at=p.updated_at,
                )
            )

        return results

    def get_product_by_id(self, db: Session, product_id: str) -> Optional[MarketplaceProductResponse]:
        """Fetch a single marketplace product with complete artisan profile."""
        p = db.query(Product).filter(Product.id == product_id).first()
        if not p:
            return None

        artisan = db.query(Artisan).filter(Artisan.id == p.artisan_id).first()
        artisan_name = artisan.name if artisan else "राधा देवी (Radha Devi)"
        artisan_location = f"{artisan.district or 'जयपुर'}, {artisan.state or 'राजस्थान'}" if artisan else "जयपुर, राजस्थान"
        artisan_craft = artisan.craft_category if artisan else "पारंपरिक हस्तशिल्प"
        artisan_bio = artisan.bio if artisan else None
        artisan_verified = artisan.is_verified if artisan else True

        return MarketplaceProductResponse(
            id=p.id,
            artisan_id=p.artisan_id,
            title=p.title,
            description=p.description,
            description_hindi=p.description_hindi,
            description_english=p.description_english,
            category=p.category,
            material=p.material,
            craft_type=p.craft_type,
            image_url=p.image_url,
            enhanced_image_url=p.enhanced_image_url,
            price=p.price,
            estimated_material_cost=p.estimated_material_cost,
            estimated_making_cost=p.estimated_making_cost,
            stock=p.stock or 1,
            status=p.status or "published",
            artisan_name=artisan_name,
            artisan_location=artisan_location,
            artisan_craft=artisan_craft,
            artisan_verified=artisan_verified,
            artisan_bio=artisan_bio,
            created_at=p.created_at,
            updated_at=p.updated_at,
        )

    def list_categories(self, db: Session) -> List[CategoryItem]:
        """Returns visual categories with dynamic product counts."""
        self.seed_initial_data(db)
        categories: List[CategoryItem] = []

        for cat in CATEGORIES_METADATA:
            # Count published products matching category keywords
            cat_conditions = [Product.category.ilike(f"%{kw}%") for kw in cat["keywords"]]
            count = db.query(Product).filter(Product.status == "published").filter(or_(*cat_conditions)).count()

            categories.append(
                CategoryItem(
                    id=cat["id"],
                    name_hindi=cat["name_hindi"],
                    name_english=cat["name_english"],
                    icon=cat["icon"],
                    product_count=count,
                )
            )

        return categories


marketplace_service = MarketplaceService()
