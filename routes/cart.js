import express from 'express';
import { auth } from '../middleware/auth.js'
import { corsOptionsDelegate } from '../middleware/cors.js'

import { getCart, addItemToCart, deleteItemFromCart } from '../controller/cart.js';

const router = express.Router();

router.get('/', corsOptionsDelegate, auth, getCart)
router.post('/addItemToCart', corsOptionsDelegate, auth, addItemToCart)
router.put('/deleteItemFromCart', corsOptionsDelegate, auth, deleteItemFromCart)


export default router;