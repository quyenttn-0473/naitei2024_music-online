import {
  getCreate,
  getDetail,
  getList,
  getUpdatePage,
  postCreate,
  postDelete,
  postUpdate,
} from '@src/controllers/admin/user.admin.controller';
import { CreateUserDto } from '@src/DTO/user/createUser';
import { UpdateUserDto } from '@src/DTO/user/updateUser';
import validateRequest from '@src/middleware/validate-request.middleware';
import { Router } from 'express';

const router = Router();

router.get('/create', getCreate);
router.post('/create', validateRequest(CreateUserDto), postCreate);

router.get('/update/:id', getUpdatePage);
router.put('/update/:id', validateRequest(UpdateUserDto), postUpdate);

router.delete('/delete/:id', postDelete);

router.get('/', getList);
router.get('/:id', getDetail);

export default router;
