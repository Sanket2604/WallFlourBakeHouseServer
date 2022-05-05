import express from 'express';
import { admin_auth } from '../middleware/auth.js'

import { homeDashboard, changeOrderControl, login } from '../adminController/home.js';
import { allProducts, getAllCategories, postCategory, updateCategory, deleteCategory, restoreCategory, postProduct, updateProduct, deleteProduct, restoreProduct } from '../adminController/product.js'
import { postPreference, updatePreference, deletePreference } from '../adminController/preference.js';
import { allUserChats, viewUserMessages, adminSendMessage, resetUnknownUserMessageCount, deleteStrangerMessage } from '../adminController/message.js'; 
import { getActiveOrders, getOneOrder, updateStatus, updatePayment, getDateOrders, getDeliveredOrders, orderDelete, orderRestore } from '../adminController/orders.js'; 
import { recentComments, deleteComments } from '../adminController/comment.js'; 
import { allUserData, oneUserData, deleteUserData, addDp, editDp, deleteDp } from '../adminController/user.js';

const router = express.Router();

// Home Routes
router.get('/home', admin_auth, homeDashboard)
router.get('/changeOrderControl', admin_auth, changeOrderControl)
router.post('/login', login)

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

// Messages Routes
router.get('/allUserChats', admin_auth, allUserChats)
router.get('/resetUUMC', admin_auth, resetUnknownUserMessageCount)
router.post('/adminSendMessage', admin_auth, adminSendMessage)
router.put('/viewUserMessages', admin_auth, viewUserMessages)
router.delete('/deleteStrangerMessage/:msgId', admin_auth, deleteStrangerMessage)

// Orders Routes
router.get('/getActiveOrders', admin_auth, getActiveOrders)
router.get('/getOneOrder/:orderId', admin_auth, getOneOrder)
router.get('/getDateOrders/:date', admin_auth, getDateOrders)
router.get('/getDeliveredOrders/:date', admin_auth, getDeliveredOrders)
router.put('/updateStatus/:orderId', admin_auth, updateStatus)
router.put('/updatePayment/:orderId', admin_auth, updatePayment)
router.delete('/orderDelete/:orderId', admin_auth, orderDelete)
router.delete('/orderRestore/:orderId', admin_auth, orderRestore)


// Comments Routes
router.get('/recentComments', admin_auth, recentComments)
router.delete('/deleteComment/:commentId', admin_auth, deleteComments)

// User Routes
router.get('/allUserData', admin_auth, allUserData)
router.get('/oneUserData/:userId', admin_auth, oneUserData)
router.delete('/deleteUserData/:userId', admin_auth, deleteUserData)

router.post('/addDp', admin_auth, addDp)
router.put('/updateDP/:dpID', admin_auth, editDp)
router.delete('/deleteDP/:dpID', admin_auth, deleteDp)


export default router;