import { Router } from 'express';

import Controller from './controller';

import authenticate from './middleware/authenticate';
import errorHandler from './middleware/error-handler';

const routes = new Router();

routes.post('/auth/login', Controller.login);

routes.get('/getAll', Controller.getAll);

routes.post('/recipe', Controller.addRecipe);
routes.post('/recipe/status', Controller.changeStepStatus);
routes.post('/recipe/delete', Controller.deleteRecipe);
routes.post('/recipe/end', Controller.endRecipe);
routes.post('/recipe/edit', Controller.editRecipe);
// routes.post('/ingredient/delete', Controller.deleteIngredient);

routes.use(errorHandler);

export default routes;
