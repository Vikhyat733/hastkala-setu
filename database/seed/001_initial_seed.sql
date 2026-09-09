-- Initial Seed Data for MELA Craft Categories
INSERT INTO craft_categories (id, name, code, description) VALUES
('cat_pottery', 'Blue Pottery & Terracotta', 'POTTERY', 'Traditional handmade earthenware, terracotta, and glazed pottery.'),
('cat_handloom', 'Handloom & Textiles', 'HANDLOOM', 'Handwoven sarees, khadi fabrics, ikat, and block prints.'),
('cat_metalwork', 'Dhokra & Brass Metalwork', 'METALWORK', 'Bell metal lost-wax casting, brass figurines, and tribal artifacts.'),
('cat_woodcraft', 'Wood Carving & Marquetry', 'WOODCRAFT', 'Carved sandalwood, rosewood panels, and lacquered toys.'),
('cat_folk_art', 'Folk Paintings (Madhubani / Warli)', 'FOLK_ART', 'Heritage traditional tribal and regional wall and canvas paintings.')
ON CONFLICT (id) DO NOTHING;
