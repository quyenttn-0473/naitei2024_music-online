import { Request, Response } from 'express';
import { t } from 'i18next';
import { getAlbumById } from '@src/services/Album.service';
import { getSongCountByAlbumId } from '@src/services/Song.service';
import { SongStatus } from '@src/enums/SongStatus.enum';

export class AlbumController {
  public static albumDetail = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const album = await getAlbumById(parseInt(id));
      if (!album) {
        req.flash('error_msg', t('error.albumNotFound'));
        return res.redirect('/user/search');
      }
      const songs = album.songs;
      const author = album.author;
      const countSong = await getSongCountByAlbumId(parseInt(id));
      const firstSong = album.songs.length > 0 ? album.songs[0] : null;
      const Deactive = SongStatus.Deleted;
      if (countSong === 0) {
        req.flash('error_msg', t('error.songNotFound'));
        return res.render('pages/detail/albums', {
          album,
          songs,
          author,
          countSong,
          firstSong,
          Deactive,
        });
      }
      return res.render('pages/detail/albums', {
        album,
        songs,
        author,
        countSong,
        firstSong,
        Deactive,
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
