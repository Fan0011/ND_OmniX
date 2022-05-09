import { makeOrder, getNonce, getOrder } from './controllers/ordersController.js';

const router = (app) => {
  app.get('/api/v1/orders', getOrder);
  app.post('/api/v1/orders', makeOrder);
  app.post('/api/v1/orders/nonce', getNonce)
};

export default router;