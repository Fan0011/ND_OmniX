import { makeOrder, getNonce, getOrder } from './controllers/ordersController.js';
import { addCollection, getCollection } from './controllers/collectionsController.js';

const router = (app) => {

  // Orders
  app.get('/api/v1/orders', getOrder);
  app.post('/api/v1/orders', makeOrder);
  app.post('/api/v1/orders/nonce', getNonce);

  // Collections
  app.post('/api/v1/collections', addCollection);
  app.get('/api/v1/collections', getCollection);
  app.get('/api/v1/collections/stats', getCollectionStat);
};

export default router;