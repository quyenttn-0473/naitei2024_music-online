import {
  getSuggestSong,
  getSuggestSongDetail,
  putSuggestSong,
} from '@src/controllers/admin/Suggest.controller';
import { Router } from 'express';

const router = Router();

router.put('/update/:id', putSuggestSong);
router.get('/', getSuggestSong);
router.get('/:id', getSuggestSongDetail);

export default router;
