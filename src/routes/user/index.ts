import { Router } from 'express';
import { UserController } from '@src/controllers/user/user.controller';

const router = Router();

router.get('/', UserController.getHomeUser);
router.get('/account', UserController.getAccoutPage);
router.get('/account/edit-profile/:id', UserController.getEditProfile);
router.put('/account/edit-profile/:id', UserController.postEditProfile);

export default router;
