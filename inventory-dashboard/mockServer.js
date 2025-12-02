// Simple mock API server for local testing using json-server
// This lets you practice against the same REST endpoints used in the UI
// without needing a real backend yet.
//
// Usage:
//   1. Install dependencies:  npm install
//   2. Start the mock API:    npm run mock:server
//   3. Set VITE_REACT_APP_API_BASE=http://localhost:4000 in your .env file
//   4. In a second terminal, run the React app: npm run dev

import jsonServer from 'json-server';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// --- Custom routes matching the API contract ---

// Adjust stock: POST /products/:id/adjust { delta, reason? }
server.post('/products/:id/adjust', (req, res) => {
  const { id } = req.params;
  const { delta = 0, reason = '' } = req.body || {};
  const numericId = isNaN(Number(id)) ? id : Number(id);

  const db = router.db; // lowdb instance
  const product = db.get('products').find({ id: numericId }).value();

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const updatedProduct = {
    ...product,
    stock: (product.stock || 0) + Number(delta),
    // For demo purposes we could track last adjustment reason somewhere.
    // In a real backend this would be persisted in a separate audit table.
  };

  db.get('products').find({ id: numericId }).assign(updatedProduct).write();

  return res.json(updatedProduct);
});

// Sales trends: GET /sales/trends?range=30
// json-server will expose /sales_trends by default from db.json.
// This route simply remaps /sales/trends to that collection.
server.get('/sales/trends', (req, res) => {
  const data = router.db.get('sales_trends').value() || [];
  // For a real backend, you would filter by the ?range query param.
  return res.json(data);
});

// Mount the standard REST routes:
//   /products, /products/:id, /alerts, /sales_trends, etc.
server.use(router);

const PORT = process.env.MOCK_API_PORT || 4000;
server.listen(PORT, () => {
  console.log(`Mock API server is running at http://localhost:${PORT}`);
});
