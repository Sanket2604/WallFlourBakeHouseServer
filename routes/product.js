import express from 'express';
import { admin_auth } from '../middleware/auth.js'

import { getProducts, getProductDetail, getHomeProducts, postCategory, postProduct, updateProduct, deleteProduct} from '../controller/product.js';

const router = express.Router();

router.get('/', getProducts)
router.get('/getHomeProducts', getHomeProducts)
router.get('/:prodName', getProductDetail)

router.post('/new_category', postCategory)
router.post('/new_product', postProduct)
router.put('/:prodId', updateProduct)
router.delete('/:prodId', deleteProduct)

export default router;