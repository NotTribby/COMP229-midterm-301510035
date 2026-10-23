// ============================================================================
// Item Controller — webapp Mid-Term Test (Week 7)
// ============================================================================
// Each exported function below is a TODO for you to implement.
// (Behavior unchanged from the JS starter — only the module system/types changed.)
// ============================================================================

import type { Request, Response, NextFunction } from 'express';
import Item from '../models/Item.js';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;

export const listItems: AsyncHandler = async (_req, res) => {
  // TODO
  res.status(501).json({ error: 'Not Implemented: listItems' });
};

export const listMyItems: AsyncHandler = async (_req, res) => {
  // TODO
  res.status(501).json({ error: 'Not Implemented: listMyItems' });
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
