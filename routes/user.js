import express from 'express';
import { auth } from '../middleware/auth.js'
import { corsOptionsDelegate } from '../middleware/cors.js'
import { login, signup, userData, userDataUpdate, userDataAddress, userPasswordUpdate, addShippingAddress, updateShippingAddress, updateBillingAddress, deleteAddress, userFavourites, addProductToFavourites, removeProductFromFavourites, getAllDp, setUserDp, addDpToWebsite } from '../controller/user.js';

const router = express.Router();

router.post('/login', corsOptionsDelegate, login)
router.post('/signup', corsOptionsDelegate, signup)

router.get('/userData', corsOptionsDelegate, auth, userData)
router.put('/userDataUpdate', corsOptionsDelegate, auth, userDataUpdate)
router.put('/userPasswordUpdate', corsOptionsDelegate, auth, userPasswordUpdate)

router.get('/userDataAddress', corsOptionsDelegate, auth, userDataAddress)
router.post('/addShippingAddress', corsOptionsDelegate, auth, addShippingAddress)
router.put('/updateShippingAddress', corsOptionsDelegate, auth, updateShippingAddress)
router.put('/updateBillingAddress', corsOptionsDelegate, auth, updateBillingAddress)
router.delete('/deleteAddress/:addressId', corsOptionsDelegate, auth, deleteAddress)

router.get('/userFavourites', corsOptionsDelegate, auth, userFavourites)
router.post('/addProductToFavourites', corsOptionsDelegate, auth, addProductToFavourites)
router.post('/removeProductFromFavourites', corsOptionsDelegate, auth, removeProductFromFavourites)

router.get('/getAllDp', corsOptionsDelegate, getAllDp)
router.put('/setUserDp', corsOptionsDelegate, auth, setUserDp)
router.post('/addDpToWebsite', corsOptionsDelegate,addDpToWebsite)

export default router;