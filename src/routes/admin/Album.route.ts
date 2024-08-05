import { AlbumController } from '@src/controllers/admin/Album.controller';
import { Router } from 'express';
import { upload } from '@src/middleware/multer';
import validateRequest from '@src/middleware/validate-request.middleware';
import { CreateAlbumDto } from '@src/DTO/album/create';
const router = Router();

router.get('/', AlbumController.getList);
router.get('/create', AlbumController.getCreate);
router.post(
  '/create',
  upload.single('avatar'),
  validateRequest(CreateAlbumDto),
  AlbumController.postCreate
);
export default router;
