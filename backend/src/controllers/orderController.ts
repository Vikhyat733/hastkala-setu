import { Request, Response } from 'express';
import { Order } from '../types/index.js';
import { INITIAL_ORDERS } from '../data/seedData.js';

let orders: Order[] = [...INITIAL_ORDERS];

export const createOrder = (req: Request, res: Response): void => {
  const {
    items,
    subtotal,
    artisanTip,
    discount,
    deliveryFee,
    total,
    customerName,
    customerPhone,
    shippingAddress,
    paymentMethod
  } = req.body;

  if (!items || items.length === 0 || !customerName) {
    res.status(400).json({ success: false, error: 'Invalid order data' });
    return;
  }

  const newOrder: Order = {
    id: `ORD-HK-${Math.floor(100000 + Math.random() * 900000)}`,
    items,
    subtotal: Number(subtotal) || 0,
    artisanTip: Number(artisanTip) || 0,
    discount: Number(discount) || 0,
    deliveryFee: Number(deliveryFee) || 0,
    total: Number(total) || 0,
    customerName,
    customerPhone,
    shippingAddress,
    paymentMethod: paymentMethod || 'upi',
    paymentStatus: 'completed',
    orderDate: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }),
    trackingNumber: `HK-IND-EXP-${Math.floor(10000000 + Math.random() * 90000000)}`
  };

  orders.unshift(newOrder);
  res.status(201).json({ success: true, data: newOrder });
};

export const getOrderById = (req: Request, res: Response): void => {
  const { id } = req.params;
  const found = orders.find((o) => o.id === id);

  if (!found) {
    res.status(404).json({ success: false, error: 'Order not found' });
    return;
  }

  res.json({ success: true, data: found });
};

export const getOrders = (req: Request, res: Response): void => {
  res.json({ success: true, count: orders.length, data: orders });
};
