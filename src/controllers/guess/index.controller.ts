import { getAlbums } from '@src/services/Album.service';
import { getAuthors } from '@src/services/Author.service';
import { songsSortByUpdatedAt } from '@src/services/Song.service';
import { Request, Response } from 'express';
import { t } from 'i18next';

export const homepage = async (req: Request, res: Response) => {
  try {
    const authors = await getAuthors();
    const albums = await getAlbums();
    const songs = await songsSortByUpdatedAt(req.t);
    res.render('index', {
      authors,
      albums,
      songs,
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

export const showSectionSong = async (req: Request, res: Response) => {
  try {
    const songs = await songsSortByUpdatedAt(req.t);
    res.render('guess/section/songNews', {
      songs,
      title: t('title'),
    });
  } catch (error) {
    res.redirect('/error');
  }
};
