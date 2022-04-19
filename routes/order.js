import express from 'express';
import { auth, admin_auth } from '../middleware/auth.js'

import { getAllOrders, getOneOrder, addUserOrder } from '../controller/order.js';

const router = express.Router();

router.get('/', auth, getAllOrders)
router.get('/:orderId', auth, getOneOrder)
router.post('/addUserOrder', auth, addUserOrder)


export default router;