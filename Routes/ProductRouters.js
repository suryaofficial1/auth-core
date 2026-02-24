
import express from 'express';
import authorize from '../Middlewares/AuthorizationUtils.js';
const productRouter = express.Router();


productRouter.get('/product', authorize, (req, res) => {
    res.status(200).json(
        [{
            p_name: "Product 1",
            p_price: 100
        },
        {
            p_name: "Product 2",
            p_price: 200
        },
        {
            p_name: "Product 3",
            p_price: 300
        },]
    )
});


export default productRouter

