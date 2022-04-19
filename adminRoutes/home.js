import express from 'express';
import { admin_auth } from '../middleware/auth.js'

import { homeDashboard, changeOrderControl } from '../adminController/home.js';
import { allProducts, getAllCategories } from '../adminController/product.js'
import { allUserData, oneUserData } from '../adminController/user.js';

const router = express.Router();

// Home Routes
router.get('/home', admin_auth, homeDashboard)
router.get('/changeOrderControl', admin_auth, changeOrderControl)

// Product Routes
router.get('/allProducts', admin_auth, allProducts)
router.get('/getAllCategories', admin_auth, getAllCategories)

// User Routes
router.get('/allUserData', admin_auth, allUserData)
router.get('/oneUserData/:userId', admin_auth, oneUserData)


export default router;