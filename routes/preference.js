import express from 'express';
import { auth, admin_auth } from '../middleware/auth.js'

import { getAllPreference, getUserPreference, postPreferenceToUser, postPreference, updatePreference, deletePreference } from '../controller/preference.js';

const router = express.Router();

router.get('/', getAllPreference)
router.get('/user', auth, getUserPreference)
router.post('/addPreferenceToUser', auth, postPreferenceToUser)
router.post('/addPreference',postPreference)
router.put('/:preferenceId', updatePreference)
router.delete('/:preferenceId', deletePreference)



export default router;