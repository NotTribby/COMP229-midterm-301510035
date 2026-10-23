// ============================================================================
// Item Controller — webapp Mid-Term Test (Week 7)
// ============================================================================
// Each exported function below is a TODO for you to implement.
// (Behavior unchanged from the JS starter — only the module system/types changed.)
// ============================================================================

import mongoose from 'mongoose';
import Item, { ITEM_TYPES, ITEM_CATEGORIES } from '../models/Item.js';
import type { Request, Response, NextFunction } from 'express';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
const ALLOWED_FIELDS = ['title', 'description', 'type', 'category', 'location', 'date', 'status'];

export const listItems: AsyncHandler = async (req, res, next) => {
  try {
    const { type, category } = req.query;
    const filter: Record<string, string> = {};

    if (type !== undefined) {
      if (typeof type !== 'string' || !(ITEM_TYPES as readonly string[]).includes(type)) {
        return res.status(400).json({ error: `type must be one of: ${ITEM_TYPES.join(', ')}` });
      }
      filter.type = type;
    }

    if (category !== undefined) {
      if (typeof category !== 'string' || !(ITEM_CATEGORIES as readonly string[]).includes(category)) {
        return res.status(400).json({ error: `category must be one of: ${ITEM_CATEGORIES.join(', ')}` });
      }
      filter.category = category;
    }

    const items = await Item.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(items);
  } catch (err) {
    next(err);
  }
};

export const listMyItems: AsyncHandler = async (req, res, next) => {
  try {
    const items = await Item.find({ owner: req.userId }).sort({ createdAt: -1 });
    return res.status(200).json(items);
  } catch (err) {
    next(err);
  }
};

export const getItemById: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid item id' });
    }

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    return res.status(200).json(item);
  } catch (err) {
    next(err);
  }
};

export const createItem: AsyncHandler = async (req, res, next) => {
  try {
    const { title, description, type, category, location, date, status } = req.body || {};

    if (!title || !description || !type || !category || !location || !date) {
      return res.status(400).json({
        error: 'title, description, type, category, location and date are required',
      });
    }

    const existing = await Item.findOne({ title: String(title).trim() });
    if (existing) {
      return res.status(409).json({ error: 'An item with this title already exists' });
    }

    const item = await Item.create({
      title,
      description,
      type,
      category,
      location,
      date,
      status,
      owner: req.userId,
    });

    return res.status(201).json(item);
  } catch (err) {
    const error = err as Error & { code?: number };
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({ error: error.message });
    }
    if (error.code === 11000) {
      return res.status(409).json({ error: 'An item with this title already exists' });
    }
    next(err);
  }
};

export const updateItem: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid item id' });
    }

    const body = req.body || {};
    const updates = Object.keys(body).filter((key) => ALLOWED_FIELDS.includes(key));
    if (updates.length === 0) {
      return res.status(400).json({ error: `Provide at least one of: ${ALLOWED_FIELDS.join(', ')}` });
    }

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (!item.owner.equals(req.userId)) {
      return res.status(403).json({ error: 'You can only update your own items' });
    }

    if (body.title && String(body.title).trim() !== item.title) {
      const duplicate = await Item.findOne({ title: String(body.title).trim() });
      if (duplicate) {
        return res.status(409).json({ error: 'An item with this title already exists' });
      }
    }

    updates.forEach((key) => item.set(key, body[key]));
    await item.save();

    return res.status(200).json(item);
  } catch (err) {
    const error = err as Error & { code?: number };
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({ error: error.message });
    }
    if (error.code === 11000) {
      return res.status(409).json({ error: 'An item with this title already exists' });
    }
    next(err);
  }
};

export const deleteMyItems: AsyncHandler = async (req, res, next) => {
  try {
    const result = await Item.deleteMany({ owner: req.userId });
    return res.status(200).json({ deletedCount: result.deletedCount });
  } catch (err) {
    next(err);
  }
};

export const deleteItem: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid item id' });
    }

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (!item.owner.equals(req.userId)) {
      return res.status(403).json({ error: 'You can only delete your own items' });
    }

    await item.deleteOne();
    return res.status(200).json({ message: 'Item deleted', id: item._id });
  } catch (err) {
    next(err);
  }
};

// Re-exported so students can `import { Item } from '../controllers/itemController.js'`
// or use it directly after they fill in the TODOs above.
export { Item };
