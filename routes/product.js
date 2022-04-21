import express from 'express';

import { getProducts, getProductDetail, getHomeProducts } from '../controller/product.js';

const router = express.Router();

router.get('/', getProducts)
router.get('/getHomeProducts', getHomeProducts)
router.get('/:prodName', getProductDetail)

export default router;