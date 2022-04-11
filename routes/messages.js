import express from 'express';
import { auth } from '../middleware/auth.js'

import { getUserMessage, userSendMessage, strangerSendMessage } from '../controller/messages.js';

const router = express.Router();

router.get('/getUserMessage', auth, getUserMessage)
router.post('/strangerSendMessage', strangerSendMessage)
router.post('/userSendMessage', auth, userSendMessage)

export default router;