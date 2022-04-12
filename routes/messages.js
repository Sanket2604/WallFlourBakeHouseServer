import express from 'express';
import { auth } from '../middleware/auth.js'
import { corsOptionsDelegate } from '../middleware/cors.js'
import { getUserMessage, userSendMessage, strangerSendMessage } from '../controller/messages.js';

const router = express.Router();

router.get('/getUserMessage', corsOptionsDelegate, auth, getUserMessage)
router.post('/strangerSendMessage', corsOptionsDelegate, strangerSendMessage)
router.post('/userSendMessage', corsOptionsDelegate, auth, userSendMessage)

export default router;