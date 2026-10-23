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

export const getItemById: AsyncHandler = async (_req, res) => {
  // TODO
  res.status(501).json({ error: 'Not Implemented: getItemById' });
};

export const createItem: AsyncHandler = async (_req, res) => {
  // TODO
  res.status(501).json({ error: 'Not Implemented: createItem' });
};

export const updateItem: AsyncHandler = async (_req, res) => {
  // TODO
  res.status(501).json({ error: 'Not Implemented: updateItem' });
};

export const deleteMyItems: AsyncHandler = async (_req, res) => {
  // TODO
  res.status(501).json({ error: 'Not Implemented: deleteMyItems' });
};

export const deleteItem: AsyncHandler = async (_req, res) => {
  // TODO
  res.status(501).json({ error: 'Not Implemented: deleteItem' });
};

// Re-exported so students can `import { Item } from '../controllers/itemController.js'`
// or use it directly after they fill in the TODOs above.
export { Item };
