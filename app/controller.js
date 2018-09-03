import User from './models/user';
import Recipe from './models/recipe';
import History from './models/history';

const createError = (message, status) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

class Controller {
  login = async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(401).json({ success: false, error: 'לא נכון' });
    try {
      const user = await User.findOne({ username, password });
      if (!user) {
        return res.status(401).json({ success: false, error: 'לא נכון' });
      }
      return res.status(200).json({ success: true, token: user.generateToken() });
    } catch (err) {
      return res.status(401).json({ success: false, error: 'db error' });
    }
  };

  addRecipe = async (req, res, next) => {
    const { icon, name, steps, preparation } = req.body;
    if (!icon || !name || !steps || !preparation)
      return res.status(400).json({ success: false, error: 'הכנס שם, תמונה, מרכיבים ואופן ההכנה' });
    try {
      const recipe = await Recipe.findOne({ name });
      if (recipe) {
        return res.status(400).json({ success: false, error: 'מתכון עם שם זהה כבר קיים' });
      }
      const rec = new Recipe({ icon, name, steps, preparation })
      rec.save();
      res.json({ success: true, recipe: rec })
    } catch (err) {
      return res.status(400).json({ success: false, error: 'db error' });
    }
  };

  deleteRecipe = async (req, res, next) => {
    try {
      await Recipe.remove({ _id: req.body.id });
      return res.json({ success: true })
    } catch (err) {
      return res.status(400).json({ success: false, error: 'db error' });
    }
  };

  editRecipe = async (req, res, next) => {
    try {
      const { recipe, id } = req.body;
      await Recipe.findOneAndUpdate(
        { _id: id },
        { ...recipe },
        { new: true },
        function (err, product) {
          if (err) {
            return res.send({ success: false });
          }
          return res.status(201).json({ success: true });
        }
      );
    } catch (err) {
      return res.status(400).json({ success: false, error: 'db error' });
    }
  };

  endRecipe = async (req, res, next) => {
    const { recipeId, steps } = req.body;
    await Recipe.findOneAndUpdate(
      { _id: recipeId },
      { steps },
      { new: true },
      function (err, product) {
        if (err) return res.send({ success: false });
        const history = new History({
          icon: product.icon,
          name: product.name,
          preparation: product.preparation,
          steps,
        });
        history.save();
        return res.json({ success: true })
      }
    );
  };

  changeStepStatus = async (req, res, next) => {
    const { recipeId, steps } = req.body;
    await Recipe.findOneAndUpdate(
      { _id: recipeId },
      { steps },
      { new: true },
      function (err, product) {
        if (err) {
          return res.send({ success: false });
        }
        return res.status(201).json({ success: true });
      }
    );
  };

  getAll = async (req, res, next) => {
    try {
      const recipes = await Recipe.find();
      const history = await History.find();
      return res.json({ success: true, recipes, history })
    } catch (err) {
      console.log('in catch', err);
      return res.status(400).json({ success: false, error: 'db error' });
    }
  };
}

export default new Controller();
