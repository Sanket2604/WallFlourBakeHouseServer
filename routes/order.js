import express from 'express';
import { auth, admin_auth } from '../middleware/auth.js'

import { getAllOrders, getOneOrder, addUserOrder, orderCancelation } from '../controller/order.js';

const router = express.Router();

router.get('/', auth, getAllOrders)
router.get('/:orderId', auth, getOneOrder)
router.post('/addUserOrder', auth, addUserOrder)
router.delete('/orderCancelation/:orderId', auth, orderCancelation)


export default router;