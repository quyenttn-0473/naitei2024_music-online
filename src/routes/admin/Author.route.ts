import { Router } from 'express';
import methodOverride from 'method-override';
import { uploadAvatar } from '@src/middleware/multer.config';
import {
  createGet,
  createPost,
  deletePost,
  deleteGet,
  detail,
  list,
  updateGet,
  updatePost,
  validateAndFetchAuthor,
} from '@src/controllers/admin/Author.controller';

const router = Router();

router.use(methodOverride('_method'));

router.get('/create', createGet);
router.post('/create', uploadAvatar, createPost);

router.get('/delete/:id', validateAndFetchAuthor, deleteGet);
router.delete('/delete/:id', validateAndFetchAuthor, deletePost);

router.get('/update/:id', validateAndFetchAuthor, updateGet);
router.put('/update/:id', validateAndFetchAuthor, uploadAvatar, updatePost);

router.get('/', list);
router.get('/:id', validateAndFetchAuthor, detail);

export default router;
