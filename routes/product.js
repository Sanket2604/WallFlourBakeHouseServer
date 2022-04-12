import express from 'express';
import { corsOptionsDelegate } from '../middleware/cors.js'
import { getProducts, getProductDetail, getHomeProducts, postCategory, postProduct, updateProduct, deleteProduct} from '../controller/product.js';

const router = express.Router();

router.get('/', getProducts)
router.get('/getHomeProducts', corsOptionsDelegate, getHomeProducts)
router.get('/:prodName', corsOptionsDelegate, getProductDetail)

router.post('/new_category', corsOptionsDelegate, postCategory)
router.post('/new_product', corsOptionsDelegate, postProduct)
router.put('/:prodId', corsOptionsDelegate, updateProduct)
router.delete('/:prodId', corsOptionsDelegate, deleteProduct)

export default router;