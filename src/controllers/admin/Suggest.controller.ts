import { sendEmailNormal } from '@src/config/mailer';
import {
  transSuggestSongApproved,
  transSuggestSongRejected,
} from '@src/constants/contentMail';
import { SongStatus } from '@src/enums/SongStatus.enum';
import { SuggestionStatus } from '@src/enums/SuggestionStatus.enum';
import { getSongById, updateSong } from '@src/services/Song.service';
import {
  getAllSuggestSong,
  getSuggestSongById,
  updateSuggestSong,
} from '@src/services/SuggestSong.service';
import { Request, Response } from 'express';
import { t } from 'i18next';

export const getSuggestSong = async (req: Request, res: Response) => {
  try {
    const listSuggest = await getAllSuggestSong();
    const suggestStatus = SuggestionStatus;
    res.render('suggest/index', {
      title: req.t('title'),
      listSuggest,
      suggestStatus,
    });
  } catch (error) {
    res.redirect('/login');
  }
};

export const getSuggestSongDetail = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const suggestSong = await getSuggestSongById(parseInt(id));
    if (!suggestSong) {
      req.flash('error_msg', req.t('error.suggestSongnotFound'));
      return res.redirect('/admin/suggest-song');
    }
    const song_Suggest = await getSongById(req, suggestSong?.song.id);
    const statusSuggest = SuggestionStatus;
    res.render('suggest/detail', {
      title: req.t('title'),
      song: song_Suggest,
      suggestSong,
      statusSuggest,
    });
  } catch (error) {
    req.flash('error_msg', req.t('error.suggestSongnotFound'));
    res.redirect('/admin/suggest-song');
  }
};

export const putSuggestSong = async (req: Request, res: Response) => {
  const { id } = req.params;
  const suggestStatus = req.body.formData.status;
  const reason = req.body.formData.reason;
  try {
    const suggestSong = await getSuggestSongById(parseInt(id));
    if (!suggestSong) {
      req.flash('error_msg', req.t('error.suggestSongnotFound'));
      return res.redirect('/admin/suggest-song');
    }
    if (suggestStatus === undefined) {
      req.flash('error_msg', req.t('error.updateSuggestSongFail'));
      return res.status(400).json({
        status: false,
        message: t('error.updateSuggestSongFail'),
      });
    }
    if (suggestStatus === SuggestionStatus.APPROVED) {
      const dataSuggest = {
        status: SuggestionStatus.APPROVED,
      };
      const dataSong = {
        status: SongStatus.Publish,
      };
      const isValue = await updateSuggestSong(parseInt(id), dataSuggest);
      const isValueSong = await updateSong(req, suggestSong.song.id, dataSong);
      if (!isValue || !isValueSong) {
        req.flash('error_msg', req.t('error.updateSuggestSongFail'));
        return res.status(400).json({
          status: false,
          message: t('error.updateSuggestSongFail'),
        });
      }
      const song_Suggest = await getSongById(req, suggestSong?.song.id);

      const dataSend = {
        username: suggestSong.user.username,
        song: song_Suggest,
      };
      await sendEmailNormal(
        suggestSong.user.email,
        transSuggestSongApproved.subject,
        transSuggestSongApproved.template(dataSend)
      );
      req.flash('success_msg', req.t('success.updateSuggestSongSuccess'));
      return res.status(200).json({
        status: true,
        message: t('success.updateSuggestSongSuccess'),
      });
    }
    if (suggestStatus === SuggestionStatus.REJECTED) {
      const dataSuggest = {
        status: SuggestionStatus.REJECTED,
      };
      const dataSong = {
        status: SongStatus.Reject,
      };
      const isValue = await updateSuggestSong(parseInt(id), dataSuggest);
      const isValueSong = await updateSong(req, suggestSong.song.id, dataSong);
      if (!isValue || !isValueSong) {
        req.flash('error_msg', req.t('error.updateSuggestSongFail'));
        return res.status(400).json({
          status: false,
          message: t('error.updateSuggestSongFail'),
        });
      }
      const song_Suggest = await getSongById(req, suggestSong?.song.id);

      const dataSend = {
        username: suggestSong.user.username,
        song: song_Suggest,
        reason: reason,
      };
      await sendEmailNormal(
        suggestSong.user.email,
        transSuggestSongRejected.subject,
        transSuggestSongRejected.template(dataSend)
      );
      req.flash('success_msg', req.t('success.updateSuggestSongSuccess'));
      return res.status(200).json({
        status: true,
        message: t('success.updateSuggestSongSuccess'),
      });
    } else {
      const dataSuggest = {
        status: SuggestionStatus.PENDING,
      };
      const dataSong = {
        status: SongStatus.Suggesting,
      };
      const isValue = await updateSuggestSong(parseInt(id), dataSuggest);
      const isValueSong = await updateSong(req, suggestSong.song.id, dataSong);
      if (!isValue || !isValueSong) {
        req.flash('error_msg', req.t('error.updateSuggestSongFail'));
        return res.status(400).json({
          status: false,
          message: t('error.updateSuggestSongFail'),
        });
      }
      req.flash('success_msg', req.t('success.updateSuggestSongSuccess'));
      return res.status(200).json({
        status: true,
        message: t('success.updateSuggestSongSuccess'),
      });
    }
  } catch (error) {
    req.flash('error_msg', req.t('error.suggestSongnotFound'));
    return res.status(500).json({
      status: false,
      message: t('error.suggestSongnotFound'),
    });
  }
};
