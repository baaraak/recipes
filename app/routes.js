import { Router } from 'express';
import multer from 'multer';

import MetaController from './controllers/meta.controller';
import AuthController from './controllers/auth.controller';
import UsersController from './controllers/users.controller';
import ProductsController from './controllers/products.controller';

import authenticate from './middleware/authenticate';
import errorHandler from './middleware/error-handler';

const routes = new Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (allowedTypes.some((t) => t === file.mimetype)) {
        return cb(null, true);
    }
    return cb(new Error('file type not allowed'), false);
};

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter,
});

routes.get('/', MetaController.index);

// Authentication
routes.post('/auth/login', AuthController.login);

// Users
routes.get('/users', UsersController.getAll);
routes.post('/users', UsersController.signup);
routes.get('/users/me', authenticate, UsersController.me);
routes.put('/users/me', authenticate, UsersController.update);
routes.delete('/users/me', authenticate, UsersController.delete);
routes.get('/users/:email', UsersController._populate, UsersController.me);

// Products
routes.get('/products/:id/swipe', authenticate, ProductsController.swipe);
routes.get('/products', ProductsController.search);
routes.post('/products', authenticate, ProductsController.create);
routes.post('/products/like', authenticate, ProductsController.like);
routes.post('/products/dislike', authenticate, ProductsController.dislike);
routes.put('/products', authenticate, ProductsController.update);
routes.get('/products/:id', ProductsController.getById);
routes.delete('/products/:id', authenticate, ProductsController._populate, ProductsController.delete);
routes.post('/products/image', authenticate, upload.single('file'), ProductsController.uploadImage);

// Categories
routes.get('/categories', authenticate, AuthController.categories);

routes.use(errorHandler);

export default routes;
