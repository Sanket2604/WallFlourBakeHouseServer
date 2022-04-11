import express from 'express';
import { auth, admin_auth } from '../middleware/auth.js'

import { getComment, postComment, updateComment, deleteComment } from '../controller/comment.js';

const router = express.Router();

router.get('/', auth, getComment)
router.post('/new_comment', auth, postComment)
router.put('/:commentId', auth, updateComment)
router.delete('/:commentId', auth, deleteComment)



export default router;