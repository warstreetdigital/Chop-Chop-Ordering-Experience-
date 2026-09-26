/**
 * CHOP CHOP Digital Ordering System
 * Phase 1 Foundation Static Server
 * 
 * Zero-build, high-performance static file server running on Port 3000.
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Body parser for JSON API requests
app.use(express.json());

// In-memory orders store
const orders = [];

// API Endpoint to process and receive real orders
app.post('/api/orders', (req, res) => {
  try {
    const { items, total, orderMode, tableNumber } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Order must contain at least one item.' 
      });
    }

    const mode = orderMode === 'dinein' ? 'dinein' : 'pickup';
    let cleanTableNumber = null;

    if (mode === 'dinein') {
      const rawTable = String(tableNumber || '').trim();
      if (!rawTable || !/^\d+$/.test(rawTable)) {
        return res.status(400).json({
          success: false,
          error: 'Please enter a valid table number for Dine-In orders.'
        });
      }
      cleanTableNumber = rawTable;
    }

    // Auto-generate 4-digit Chop Chop Order Number (e.g., #4812, #8301)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `#${randomSuffix}`;
    const timestamp = new Date().toISOString();

    const orderRecord = {
      orderNumber,
      timestamp,
      orderMode: mode,
      tableNumber: cleanTableNumber,
      items: items.map(it => ({
        name: it.name,
        size: it.sizeLabel || it.size || 'Standard',
        modifiers: it.modifiersText || '',
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        subtotal: it.unitPrice * it.quantity,
      })),
      total: Number(total) || 0,
      status: 'received'
    };

    orders.push(orderRecord);
    const tableLog = cleanTableNumber ? ` | Table: ${cleanTableNumber}` : '';
    console.log(`[CHOP CHOP] New Order Received: ${orderNumber} | Mode: ${orderRecord.orderMode}${tableLog} | Items: ${items.length} | Total: $${orderRecord.total}`);

    return res.status(200).json({
      success: true,
      orderNumber,
      orderMode: mode,
      tableNumber: cleanTableNumber,
      order: orderRecord
    });
  } catch (err) {
    console.error('[CHOP CHOP] Error processing order:', err);
    return res.status(500).json({ 
      success: false, 
      error: 'Unable to process order. Please try again.' 
    });
  }
});

// Determine static root: dist/ if production and exists, else root directory
const isProduction = process.env.NODE_ENV === 'production';
const distPath = path.join(__dirname, 'dist');
const staticRoot = (isProduction && fs.existsSync(distPath)) ? distPath : __dirname;

// Serve static assets with caching headers for performance
app.use(express.static(staticRoot, {
  maxAge: isProduction ? '1h' : '0',
  etag: true,
}));

// Fallback to index.html
app.get('*', (req, res) => {
  const indexPath = path.join(staticRoot, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[CHOP CHOP] Digital Menu running at http://0.0.0.0:${PORT}`);
  console.log(`[CHOP CHOP] Static root: ${staticRoot}`);
});
