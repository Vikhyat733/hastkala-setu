import { Request, Response } from 'express';
import { Product } from '../types/index.js';
import { INITIAL_PRODUCTS } from '../data/seedData.js';

// In-memory catalog (extensible with MongoDB / PostgreSQL)
let products: Product[] = [...INITIAL_PRODUCTS];

export const getProducts = (req: Request, res: Response): void => {
  const { category, state, giOnly, ecoOnly, search, sort } = req.query;

  let filtered = [...products];

  if (category && category !== 'all') {
    filtered = filtered.filter((p) => p.category === category);
  }

  if (state && state !== 'All Regions') {
    filtered = filtered.filter((p) => p.originState.toLowerCase() === (state as string).toLowerCase());
  }

  if (giOnly === 'true') {
    filtered = filtered.filter((p) => p.giTagStatus.hasGiTag);
  }

  if (ecoOnly === 'true') {
    filtered = filtered.filter((p) => p.ecoFriendly);
  }

  if (search) {
    const q = (search as string).toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.en.toLowerCase().includes(q) ||
        p.title.hi.toLowerCase().includes(q) ||
        p.artisan.name.toLowerCase().includes(q) ||
        p.originState.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  if (sort === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  res.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
};

export const getProductById = (req: Request, res: Response): void => {
  const { id } = req.params;
  const found = products.find((p) => p.id === id);

  if (!found) {
    res.status(404).json({ success: false, error: 'Product not found' });
    return;
  }

  res.json({ success: true, data: found });
};

export const createProduct = (req: Request, res: Response): void => {
  const newProduct: Product = {
    id: `craft-${Date.now()}`,
    createdAt: new Date().toISOString(),
    rating: 5.0,
    reviewCount: 0,
    reviews: [],
    ...req.body
  };

  products.unshift(newProduct);
  res.status(201).json({ success: true, data: newProduct });
};

export const updateProduct = (req: Request, res: Response): void => {
  const { id } = req.params;
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    res.status(404).json({ success: false, error: 'Product not found' });
    return;
  }

  products[index] = { ...products[index], ...req.body };
  res.json({ success: true, data: products[index] });
};

export const deleteProduct = (req: Request, res: Response): void => {
  const { id } = req.params;
  products = products.filter((p) => p.id !== id);
  res.json({ success: true, message: 'Product removed' });
};
