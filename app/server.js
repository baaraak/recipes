import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import helmet from 'helmet';

import routes from './routes';
import Constants from './config/constants';

const app = express();

var server = require('http').Server(app);

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());

// Mount API routes
app.use(Constants.apiPrefix, routes);


server.listen(Constants.port, () => {
  console.log(`
    Port: ${Constants.port}
    Env: ${app.get('env')}
  `);
});

export default app;
