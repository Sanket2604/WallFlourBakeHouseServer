import express from 'express';
import { auth } from '../middleware/auth.js'
import { login, signup, userData, userDataUpdate, userDataAddress, userPasswordUpdate, addShippingAddress, updateShippingAddress, updateBillingAddress, deleteAddress, userFavourites, addProductToFavourites, removeProductFromFavourites, getAllDp, setUserDp, addDpToWebsite } from '../controller/user.js';

const router = express.Router();

router.post('/login', login)
router.post('/signup', signup)

router.get('/userData', auth, userData)
router.put('/userDataUpdate', auth, userDataUpdate)
router.put('/userPasswordUpdate', auth, userPasswordUpdate)

router.get('/userDataAddress', auth, userDataAddress)
router.post('/addShippingAddress', auth, addShippingAddress)
router.put('/updateShippingAddress', auth, updateShippingAddress)
router.put('/updateBillingAddress', auth, updateBillingAddress)
router.delete('/deleteAddress/:addressId', auth, deleteAddress)

router.get('/userFavourites', auth, userFavourites)
router.post('/addProductToFavourites', auth, addProductToFavourites)
router.post('/removeProductFromFavourites', auth, removeProductFromFavourites)

router.get('/getAllDp', getAllDp)
router.put('/setUserDp', auth, setUserDp)
router.post('/addDpToWebsite',addDpToWebsite)

export default router;