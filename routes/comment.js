import express from 'express';
import { auth } from '../middleware/auth.js'
import { corsOptionsDelegate } from '../middleware/cors.js'

import { getComment, postComment, updateComment, deleteComment } from '../controller/comment.js';

const router = express.Router();

router.get('/', corsOptionsDelegate, auth, getComment)
router.post('/new_comment', corsOptionsDelegate, auth, postComment)
router.put('/:commentId', corsOptionsDelegate, auth, updateComment)
router.delete('/:commentId', corsOptionsDelegate, auth, deleteComment)



export default router;