import { makeOrder, getNonce, getOrder, changeOrderStatus } from './controllers/ordersController.js';
import { addCollection, getCollection, getCollectionStat, getCollectionChart } from './controllers/collectionsController.js';

const router = (app) => {

  // Orders
  app.get('/api/v1/orders', getOrder);
  app.post('/api/v1/orders', makeOrder);
  app.post('/api/v1/orders/nonce', getNonce);
  app.post('/api/v1/orders/changeOrderStatus', changeOrderStatus);

  // Collections
  app.post('/api/v1/collections', addCollection);
  app.get('/api/v1/collections', getCollection);
  app.get('/api/v1/collections/stats', getCollectionStat);
  app.get('/api/v1/collections/chart', getCollectionChart);
};

export default router;