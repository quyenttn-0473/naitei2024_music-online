import { Router } from 'express';
import { UserController } from '@src/controllers/user/user.controller';
import detailRoutes from './Detail.route';
import playlistRoutes from './Playlist.route';
import search from './Search.route';

import {
  showSectionAlbum,
  showSectionArtist,
  showSectionSong,
} from '@src/controllers/user/user.controller';
import { sessionMiddleware } from '@src/middleware/sessionMiddleware';
import {
  addSongToLikedSong,
  deleteSongFromLikedSong,
  getLikedSong,
} from '@src/controllers/user/Song.user.controller';
import { upload } from '@src/middleware/multer';

const router = Router();
router.use(sessionMiddleware);

router.use('/detail', detailRoutes);
router.use('/playlists', playlistRoutes);
router.use('/search', search);

router.get('/', UserController.getHomeUser);

router.get('/account', UserController.getAccoutPage);

router.get('/account/edit-profile/:id', UserController.getEditProfile);
router.put('/account/edit-profile/:id', UserController.postEditProfile);

router.get('/account/change-password/OTP/:id', UserController.getInputOTP);
router.put(
  '/account/change-password/OTP/:id',
  UserController.putChangePassword
);

router.get('/account/change-password/:id', UserController.getChangePassword);
router.post('/account/change-password/:id', UserController.postChangePassword);

router.get('/section/artists', showSectionArtist);
router.get('/section/albums', showSectionAlbum);
router.get('/section/songs', showSectionSong);

router.delete('/liked-songs', deleteSongFromLikedSong);
router.post('/liked-songs', addSongToLikedSong);
router.get('/liked-song', getLikedSong);

router.get('/suggest-song', UserController.getSuggestSong);
router.post(
  '/suggest-song/send',
  upload.fields([{ name: 'image' }, { name: 'song' }]),
  UserController.postSuggestSong
);
export default router;
