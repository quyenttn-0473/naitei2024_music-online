import { getAlbums } from '@src/services/Album.service';
import { getAuthors } from '@src/services/Author.service';
import { Request, Response } from 'express';
import { t } from 'i18next';

export const homepage = async (req: Request, res: Response) => {
  try {
    const authors = await getAuthors();
    const albums = await getAlbums();
    res.render('index', {
      authors,
      albums,
      title: t('title'),
    });
  } catch (error) {
    res.redirect('/error');
  }
};

export const showSectionArtist = async (req: Request, res: Response) => {
  try {
    const authors = await getAuthors();
    res.render('guess/section/popularArtist', {
      authors,
      title: t('title'),
    });
  } catch (error) {
    res.redirect('/error');
  }
};

export const showSectionAlbum = async (req: Request, res: Response) => {
  try {
    const albums = await getAlbums();
    res.render('guess/section/popularAlbum', {
      albums,
      title: t('title'),
    });
  } catch (error) {
    res.redirect('/error');
  }
};
