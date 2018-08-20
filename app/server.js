import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import helmet from 'helmet';

import routes from './routes';
import Constants from './config/constants';
import SocketController from './controllers/socket.controller';
import mocks from './services/mocks';

const app = express();
var io = module.exports.io = require('socket.io')();

var server = require('http').Server(app);

// Enable CORS with various options
// https://github.com/expressjs/cors
app.use(cors());
app.use(helmet());

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

io.on('connection', SocketController);

io.attach(server);

// mocks().then(() => {
server.listen(Constants.port, () => {
  // eslint-disable-next-line no-console
  console.log(`
    Port: ${Constants.port}
    Env: ${app.get('env')}
  `);
});
// });

export default app;
