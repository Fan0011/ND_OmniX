import { Application } from 'express';
import ordersRouter from './ordersRouter';
import collectionsRouter from './collectionsRouter';

export default class Routes {

  constructor(app: Application) {
    // orders reoutes
    app.use('/api/v1/orders', ordersRouter);
    // collections routes
    app.use('/api/v1/collections', collectionsRouter);
  }
}