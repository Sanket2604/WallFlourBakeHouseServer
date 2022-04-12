import express from 'express';
import { auth } from '../middleware/auth.js'
import { corsOptionsDelegate } from '../middleware/cors.js'
import { getAllOrders, getOneOrder, addUserOrder } from '../controller/order.js';

const router = express.Router();

router.get('/', corsOptionsDelegate, auth, getAllOrders)
router.get('/:orderId', corsOptionsDelegate, auth, getOneOrder)
router.post('/addUserOrder', corsOptionsDelegate, auth, addUserOrder)

export default router;