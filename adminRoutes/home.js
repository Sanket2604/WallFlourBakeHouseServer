import express from 'express';
import { admin_auth } from '../middleware/auth.js'

import { homeDashboard, changeOrderControl } from '../adminController/home.js';
import { allProducts, getAllCategories, postCategory, updateCategory, deleteCategory, restoreCategory, postProduct, updateProduct, deleteProduct, restoreProduct } from '../adminController/product.js'
import { postPreference, updatePreference, deletePreference } from '../adminController/preference.js';
import { allUserData, oneUserData } from '../adminController/user.js';

const router = express.Router();

// Home Routes
router.get('/home', admin_auth, homeDashboard)
router.get('/changeOrderControl', admin_auth, changeOrderControl)

// Product Routes
router.get('/allProducts', admin_auth, allProducts)
router.get('/getAllCategories', admin_auth, getAllCategories)
router.post('/new_category', admin_auth, postCategory)
router.post('/new_product', admin_auth, postProduct)
router.put('/updateCategory/:catId', admin_auth, updateCategory)
router.put('/updateProduct/:prodId', admin_auth, updateProduct)
router.delete('/deleteProduct/:prodId', admin_auth, deleteProduct)
router.delete('/deleteCategory/:catId', admin_auth, deleteCategory)
router.put('/restoreCategory/:catId', admin_auth, restoreCategory)
router.put('/restoreProduct/:prodId', admin_auth, restoreProduct)

// Preferences Routes
router.post('/new_preference', admin_auth, postPreference)
router.put('/updatePreference/:prefId', admin_auth, updatePreference)
router.delete('/deletePreference/:prefId', admin_auth, deletePreference)

// User Routes
router.get('/allUserData', admin_auth, allUserData)
router.get('/oneUserData/:userId', admin_auth, oneUserData)


export default router;