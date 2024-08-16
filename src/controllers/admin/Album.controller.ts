import { Request, Response } from 'express';
import { t } from 'i18next';
import { getAuthors } from '@src/services/Author.service';
import { uploadImg } from '@src/services/LoadFirebase';
import {
  createAlbum,
  getAlbumById,
  deleteAlbum,
  getAlbumPage,
  updateAlbum,
  addSongToAlbum,
  removeSongFromAlbum,
} from '@src/services/Album.service';
import { getAllSongs, getSongCountByAlbumId } from '@src/services/Song.service';
import { formatDateYMD } from '@src/utils/formatDate';
import { Album } from '@src/entities/Album.entity';
import { Change } from '@src/constants/change';
import { Author } from '@src/entities/Author.entity';

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
          imgUrl = Change.imageUrl;
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
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = 5;
    try {
      const { albums, total } = await getAlbumPage(page, pageSize);
      const totalPages = Math.ceil(total / pageSize);
      if (!albums) {
        req.flash('error_msg', t('error.noAlbums'));
        return res.render('albums/list', {});
      }
      return res.render('albums/list', {
        albums,
        currentPage: page,
        totalPages,
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
      if (!album) {
        req.flash('error_msg', t('error.albumNotFound'));
        return res.redirect('/admin/albums');
      }
      const songList = await getAllSongs(req);
      const songs = album.songs;
      const author = album.author;
      const countSong = await getSongCountByAlbumId(parseInt(id));
      const availableSongs = songList.filter(
        (song) =>
          !song.album && !songs.some((albumSong) => albumSong.id === song.id)
      );
      if (countSong === 0) {
        req.flash('error_msg', t('error.songNotFound'));
        return res.render('albums/detail', {
          album,
          songs,
          author,
          countSong,
          availableSongs,
        });
      }

      return res.render('albums/detail', {
        album,
        songs,
        author,
        countSong,
        availableSongs,
      });
    } catch (error) {
      req.flash('error_msg', t('error.system'));
      return res.render('error', {
        message: t('error.system'),
        error: { status: 500, stack: error.stack },
      });
    }
  };
  public static getUpdate = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const album = await getAlbumById(parseInt(id));
      if (!album) {
        req.flash('error_msg', t('error.albumNotFound'));
        return res.redirect('/admin/albums');
      }
      const author_album = album.author;
      const releaseDate = formatDateYMD(album.releaseDate);
      const authorList = await getAuthors();
      if (!authorList) {
        req.flash('error_msg', t('error.authorNotFound'));
        return res.redirect(`/admin/albums/${id}`);
      }
      res.render('albums/update', {
        album,
        releaseDate,
        author_album,
        authors: authorList,
      });
    } catch (error) {
      res.redirect('/error');
    }
  };
  public static postUpdate = async (req: Request, res: Response) => {
    const file = req.file;
    const { id } = req.params;
    const title = req.body.title;
    const releaseDate = new Date(req.body.releaseDate);
    const authorId = parseInt(req.body.authorId);

    try {
      const albumCurrent = await getAlbumById(parseInt(id));
      if (!albumCurrent) {
        req.flash('error_msg', t('error.albumNotFound'));
        return res.redirect('/admin/albums');
      }
      let imageUrl = albumCurrent.imageUrl;

      if (file) {
        const imgUrl = await uploadImg(file);
        if (imgUrl) {
          imageUrl = imgUrl;
        }
      }

      const updateData: Partial<Album> = {};
      if (title !== albumCurrent.title) updateData.title = title;
      if (releaseDate !== albumCurrent.releaseDate)
        updateData.releaseDate = releaseDate;
      if (imageUrl !== albumCurrent.imageUrl) updateData.imageUrl = imageUrl;
      if (authorId !== albumCurrent.author.id) {
        if (!updateData.author) {
          updateData.author = {} as Author; // Khởi tạo nếu không tồn tại
        }
        updateData.author.id = authorId;
      }

      const value = await updateAlbum(parseInt(id), updateData);
      if (!value) {
        req.flash('error_msg', t('error.updateFail'));
        return res.redirect(`/admin/albums/update/${id}`);
      }
      req.flash('success_msg', t('success.updateSuccess'));
      return res.redirect(`/admin/albums/update/${id}`);
    } catch (error) {
      res.redirect('/error');
    }
  };

  public static getDelete = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const album = await getAlbumById(parseInt(id));
      if (!album) {
        req.flash('error_msg', t('error.albumNotFound'));
        return res.redirect('/admin/albums');
      }
      const countSong = await getSongCountByAlbumId(parseInt(id));
      res.render('albums/delete', {
        countSong,
        album,
      });
    } catch (error) {
      res.redirect('/error');
    }
  };
  public static postDelete = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const album = await getAlbumById(parseInt(id));
      if (!album) {
        req.flash('error_msg', t('error.albumNotFound'));
        return res.redirect('/admin/albums');
      }
      const value = await deleteAlbum(parseInt(id));
      if (!value) {
        req.flash('error_msg', t('error.deleteFail'));
        res.redirect(`/admin/albums/delete/${id}`);
      }
      req.flash('success_msg', t('success.deleteSuccess'));
      res.redirect(`/admin/albums`);
    } catch (error) {
      res.redirect('/error');
    }
  };

  public static addSongPost = async (req: Request, res: Response) => {
    const albumId = parseInt(req.params.id, 10);
    try {
      const { songId } = req.body;

      await addSongToAlbum(req, albumId, songId);
      res.redirect(`/admin/albums/${albumId}`);
    } catch (error) {
      req.flash('error_msg', req.t('error.failedToAddSongPlaylist'));
      res.redirect(`/admin/albums/${albumId}`);
    }
  };

  public static removeSongPost = async (req: Request, res: Response) => {
    const albumId = parseInt(req.params.id, 10);
    try {
      const { songId } = req.body;
      await removeSongFromAlbum(req, albumId, Number(songId));
      res.redirect(`/admin/albums/${albumId}`);
    } catch (error) {
      req.flash('error_msg', req.t('error.failedToRemoveSongAlbum'));
      res.redirect(`/admin/albums/${albumId}`);
    }
  };
}
