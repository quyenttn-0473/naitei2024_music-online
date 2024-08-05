import { Request, Response } from 'express';
import { t } from 'i18next';
import { getAuthors } from '@src/services/Author.service';
import { uploadImg } from '@src/services/LoadFirebase';
import {
  createAlbum,
  getAlbumById,
  getAlbums,
} from '@src/services/Album.service';
import { getSongCountByAlbumId } from '@src/services/Song.service';

export class AlbumController {
  public static getCreate = async (req: Request, res: Response) => {
    try {
      const authors = await getAuthors();
      res.render('albums/create', {
        authors,
      });
    } catch (error) {
      req.flash('error_msg', t('error.noPageCreate'));
      return res.render('error', {
        message: t('error.noPageCreate'),
        error: { status: 500, stack: error.stack },
      });
    }
  };
  public static postCreate = async (req: Request, res: Response) => {
    const file = req.file;
    let imgUrl: string = '';
    try {
      if (file) {
        const url = await uploadImg(file);
        if (url !== null) {
          imgUrl = url;
        } else {
          imgUrl =
            'https://firebasestorage.googleapis.com/v0/b/musiconline-3cd71.appspot.com/o/images%2Fimg2.jpg?alt=media&token=a7ce37bd-93f8-44e4-bd60-f8098163419b';
        }
      }
      const title = req.body.title;
      const imageUrl = imgUrl;
      const releaseDate = new Date(req.body.releaseDate);
      const authorId = parseInt(req.body.authorId);
      const value = await createAlbum({
        title,
        imageUrl,
        releaseDate,
        authorId,
      });
      if (!value) {
        req.flash('error_msg', t('error.createFail'));
        return res.redirect('/admin/lbums/create');
      }
      req.flash('success_msg', t('success.createSuccess'));
      return res.redirect('/admin/albums/create');
    } catch (error) {
      req.flash('error_msg', t('error.noPageCreate'));
      return res.render('error', {
        message: t('error.noPageCreate'),
        error: { status: 500, stack: error.stack },
      });
    }
  };
  public static getList = async (req: Request, res: Response) => {
    try {
      const albums = await getAlbums();
      if (!albums) {
        req.flash('error_msg', t('error.noAlbums'));
        return res.render('albums/list', {});
      }
      return res.render('albums/list', {
        albums,
      });
    } catch (error) {
      req.flash('error_msg', t('error.system'));
      return res.render('error', {
        message: t('error.system'),
        error: { status: 500, stack: error.stack },
      });
    }
  };
  public static getDetail = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const album = await getAlbumById(parseInt(id));
      const songs = album.songs;
      const author = album.author;
      const countSong = await getSongCountByAlbumId(parseInt(id));
      if (countSong === 0) {
        req.flash('error_msg', t('error.songNotFound'));
        return res.render('albums/detail', {
          album,
          songs,
          author,
          countSong,
        });
      }
      return res.render('albums/detail', {
        album,
        songs,
        author,
        countSong,
      });
    } catch (error) {
      req.flash('error_msg', t('error.system'));
      return res.render('error', {
        message: t('error.system'),
        error: { status: 500, stack: error.stack },
      });
    }
  };
}
