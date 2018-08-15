import BaseController from './base.controller';
import Bid from '../models/bid';

class BidController extends BaseController {
    create = async (req, res, next) => {
        const { title, description, price, productID } = req.body;
        const user = req.user || req.currentUser;
        const bid = new Bid({ title, description, price, from: user._id, to: productID });
        try {
            await bid.save();
            res.json({ success: true })
        } catch (e) {
            res.json({ success: false })
        }
    };
}

export default new BidController();
