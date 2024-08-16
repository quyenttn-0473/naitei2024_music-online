import { AlbumController } from '@src/controllers/admin/Album.controller';
import { Router } from 'express';
import { upload } from '@src/middleware/multer';
import validateRequest from '@src/middleware/validate-request.middleware';
import { CreateAlbumDto } from '@src/DTO/album/create';
const router = Router();

router.get('/', AlbumController.getList);
router.get('/list', AlbumController.getList);
router.get('/create', AlbumController.getCreate);
router.post(
  '/create',
  upload.single('avatar'),
  validateRequest(CreateAlbumDto),
  AlbumController.postCreate
);
router.get('/:id', AlbumController.getDetail);
router.get('/update/:id', AlbumController.getUpdate);
router.put(
  '/update/:id',
  upload.single('avatar'),
  validateRequest(CreateAlbumDto),
  AlbumController.postUpdate
);
router.get('/delete/:id', AlbumController.getDelete);
router.delete('/delete/:id', AlbumController.postDelete);

router.post('/add-song/:id', AlbumController.addSongPost);
router.post('/remove-song/:id', AlbumController.removeSongPost);

export default router;
