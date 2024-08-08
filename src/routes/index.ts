import {
  homepage,
  showSectionAlbum,
  showSectionArtist,
  showSectionSong,
} from '../controllers/guess/index.controller';
import { Router } from 'express';
import index from './admin/index';
import validateRequest from '@src/middleware/validate-request.middleware';
import { UserController } from '@src/controllers/user/user.controller';
import { RegisterDto } from '@src/DTO/user/register';
import { LoginDto } from '@src/DTO/user/login';

const router = Router();

router.get('/', homepage);

router.use('/admin', index);

router.get('/register', UserController.getRegister);
router.post('/check-username', UserController.checkUsername);
router.post(
  '/register',
  validateRequest(RegisterDto),
  UserController.postRegister
);
router.get('/login', UserController.getLogin);
router.post('/login', validateRequest(LoginDto), UserController.postLogin);
router.get('/logout', UserController.logout);

router.get('/error', (req, res) => {
  res.render('error', { title: req.t('error.title') });
});

router.get('/section/artists', showSectionArtist);
router.get('/section/albums', showSectionAlbum);
router.get('/section/songs', showSectionSong);

export default router;
