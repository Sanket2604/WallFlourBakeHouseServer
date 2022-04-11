import express from 'express';
import { auth } from '../middleware/auth.js'

import { getCart, addItemToCart, deleteItemFromCart } from '../controller/cart.js';

const router = express.Router();

router.get('/', auth, getCart)
router.post('/addItemToCart', auth, addItemToCart)
router.put('/deleteItemFromCart', auth, deleteItemFromCart)


export default router;