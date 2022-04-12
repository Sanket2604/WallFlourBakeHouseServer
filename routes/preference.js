import express from 'express';
import { auth } from '../middleware/auth.js'
import { corsOptionsDelegate } from '../middleware/cors.js'
import { getAllPreference, getUserPreference, postPreferenceToUser, postPreference, updatePreference, deletePreference } from '../controller/preference.js';

const router = express.Router();

router.get('/', corsOptionsDelegate, getAllPreference)
router.get('/user', corsOptionsDelegate, auth, getUserPreference)
router.post('/addPreferenceToUser', corsOptionsDelegate, auth, postPreferenceToUser)
router.post('/addPreference', corsOptionsDelegate, postPreference)
router.put('/:preferenceId', corsOptionsDelegate, updatePreference)
router.delete('/:preferenceId', corsOptionsDelegate, deletePreference)



export default router;