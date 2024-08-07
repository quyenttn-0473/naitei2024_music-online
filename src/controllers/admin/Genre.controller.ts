import { Genre } from '@src/entities/Genre.entity';
import {
  createGenre,
  deleteGenre,
  getGenreById,
  getGenres,
  updateGenre,
} from '@src/services/Genre.service';
import { countSongsByGenreId } from '@src/services/Song.service';
import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { TFunction } from 'i18next';

interface GenreRequest extends Request {
  genre?: Genre;
  t: TFunction;
}

export async function validateAndFetchGenre(
  req: GenreRequest,
  res: Response,
  next: NextFunction
) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    req.flash('error_msg', req.t('error.invalidGenreId'));
    return res.redirect('/error');
  }

  try {
    const genre = await getGenreById(id);
    if (genre === null) {
      req.flash('error_msg', req.t('error.genreNotFound'));
      return res.redirect('/error');
    }
    req.genre = genre;
    next();
  } catch (error) {
    req.flash('error_msg', req.t('error.failedToFetchGenres'));
    return res.redirect('/error');
  }
}

export const list = asyncHandler(async (req: Request, res: Response) => {
  try {
    const genres = await getGenres();
    res.render('genres/index', {
      genres,
      title: req.t('genres.title'),
    });
  } catch (error) {
    req.flash('error_msg', req.t('error.failedToFetchGenres'));
    res.redirect('/error');
  }
});

export const detail = asyncHandler(async (req: GenreRequest, res: Response) => {
  try {
    const genre = req.genre;
    if (!genre) {
      req.flash('error_msg', req.t('error.genreNotFound'));
      return res.redirect('/error');
    }

    const countSong = await countSongsByGenreId(genre.id, req.t);

    res.render('genres/detail', {
      genre,
      countSong,
      title: req.t('genres.titleDetailGenre'),
    });
  } catch (error) {
    req.flash('error_msg', req.t('error.failedToFetchGenres'));
    res.redirect('/error');
  }
});

export const createGet = (req: GenreRequest, res: Response) => {
  res.render('genres/create', {
    title: req.t('genres.createNewGenre'),
  });
};

export const createPost = async (req: GenreRequest, res: Response) => {
  try {
    const { name } = req.body;
    const genre = await createGenre({ name }, req.t);
    req.flash('success_msg', req.t('genre.successfullyCreated'));
    res.redirect(`/admin/genres/${genre.id}`);
  } catch (error) {
    req.flash('error_msg', req.t('error.failedToCreateGenre'));
    res.redirect('/admin/genres/create');
  }
};

export const updateGet = (req: GenreRequest, res: Response) => {
  try {
    const genre = req.genre;
    res.render('genres/update', {
      title: req.t('genres.updateGenre'),
      genre,
      flash: req.flash(),
    });
  } catch (error) {
    req.flash('error_msg', req.t('error.failedToFetchGenres'));
    res.redirect('/error');
  }
};

export const updatePost = async (req: GenreRequest, res: Response) => {
  try {
    const genreId = parseInt(req.params.id, 10);
    const { name } = req.body;

    const genre = await updateGenre(genreId, { name }, req.t);
    req.flash('success_msg', req.t('genre.successfullyUpdated'));
    res.redirect(`/admin/genres/${genre.id}`);
  } catch (error) {
    req.flash('error_msg', req.t('error.failedToUpdateGenre'));
    res.redirect(`/admin/genres/${req.params.id}/edit`);
  }
};

export const deleteGet = (req: GenreRequest, res: Response) => {
  try {
    const genre = req.genre;
    res.render('genres/delete', {
      title: req.t('genres.deleteGenre'),
      genre,
      t: req.t,
      flash: req.flash(),
    });
  } catch (error) {
    req.flash('error_msg', req.t('error.failedToFetchGenres'));
    res.redirect('/error');
  }
};

export const deletePost = async (req: GenreRequest, res: Response) => {
  try {
    const genreId = parseInt(req.params.id, 10);
    await deleteGenre(genreId, req.t);
    req.flash('success_msg', req.t('genre.successfullyDeleted'));
    res.redirect('/admin/genres');
  } catch (error) {
    req.flash('error_msg', req.t('error.failedToDeleteGenre'));
    res.redirect(`/admin/genres/${req.params.id}/delete`);
  }
};
