import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import helmet from 'helmet';

import routes from './routes';
import Constants from './config/constants';

const app = express();


// Enable CORS with various options
// https://github.com/expressjs/cors
app.use(cors());

// Parse incoming request bodies
// https://github.com/expressjs/body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Lets you use HTTP verbs such as PUT or DELETE
// https://github.com/expressjs/method-override
app.use(methodOverride());

// Mount public routes
app.use('/test', express.static(`public`));
app.use('/uploads', express.static(`uploads`));

// Mount API routes
app.use(Constants.apiPrefix, routes);

app.listen(Constants.port, () => {
  // eslint-disable-next-line no-console
  console.log(`
    Port: ${Constants.port}
    Env: ${app.get('env')}
  `);
});

export default app;
