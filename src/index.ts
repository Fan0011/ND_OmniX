import { Application, urlencoded, json } from 'express';
import * as morgan from 'morgan';
import * as helmet from 'helmet';
import * as winston from 'winston';
import * as mongoose from 'mongoose';

import rateLimiter from './middlewares/rateLimit';
import { unCoughtErrorHandler } from './handlers/errorHandler';
import Routes from './routes';
import { installBSCTestEvents, installRopstenEvents } from './services/events';
import { hasUserNFT } from './services/utils';

// app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)

export default class Server {
  constructor(app: Application) {
    this.config(app);
    this.connect();
    new Routes(app);
  }

  public connect(): void {
    mongoose.connect(process.env.DB_CONFIG as string)
        .then(() => console.log('Connected to Database'))
        .catch(err => {
        throw new Error(err)
        });
    mongoose.set('debug', true);
  }

  public config(app: Application): void {
    app.use(morgan('dev'));
    app.use(urlencoded({ extended: true }));
    app.use(json());
    app.use(helmet());
    app.use(rateLimiter()); //  apply to all requests
    app.use(unCoughtErrorHandler);

    installBSCTestEvents();
    installRopstenEvents();

    hasUserNFT("0", "0", 0);
  }
}

process.on('beforeExit', function (err) {
  winston.error(JSON.stringify(err));
  console.error(err);
});