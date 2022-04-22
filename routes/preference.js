import express from 'express';
import { auth, admin_auth } from '../middleware/auth.js'

import { getAllPreference, getUserPreference, postPreferenceToUser } from '../controller/preference.js';

const router = express.Router();

router.get('/', getAllPreference)
router.get('/user', auth, getUserPreference)
router.post('/addPreferenceToUser', auth, postPreferenceToUser)

export default router;