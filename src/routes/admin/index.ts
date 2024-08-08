import { Router } from 'express';
import genreRoutes from './Genre.route';
import userRoutes from './User.route';
import authorRoutes from './Author.route';
const router = Router();

router.use('/genres', genreRoutes);
router.use('/users', userRoutes);
router.use('/authors', authorRoutes);
router.use('/', genreRoutes);

export default router;
