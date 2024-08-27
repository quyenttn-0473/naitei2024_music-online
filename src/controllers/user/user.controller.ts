import { formatDateYMD } from '@src/utils/formatDate';
import UserService from '@src/services/user.service';
import { Request, Response } from 'express';
import { t } from 'i18next';
import { comparePassword, hashPassword } from '@src/utils/passwordUtils';
import { UserRoles, UserStatus } from '@src/enums/UserRoles.enum';
import { User } from '@src/entities/User.entity';
import {
  createAuthor,
  getAuthorByFullName,
  getAuthorById,
  getAuthors,
} from '@src/services/Author.service';
import { getAlbums } from '@src/services/Album.service';
import {
  createSong,
  getSongById,
  getAllSongs,
  getSongsByPlaylistId,
} from '@src/services/Song.service';
import { sendEmailNormal } from '@src/config/mailer';
import { transOTPEmail, transSuggestSong } from '@src/constants/contentMail';
import { PlaylistTitle } from '@src/enums/PlaylistTypes.enum';
import { getPlaylistByUserIdAndTitle } from '@src/services/Playlist.service';
import { getGenres, getGenresByIds } from '@src/services/Genre.service';
import { Change } from '@src/constants/change';
import { uploadFileToFirebase } from '@src/utils/fileUpload.utils';
import { SongStatus } from '@src/enums/SongStatus.enum';
import { createSuggestSong } from '@src/services/SuggestSong.service';

export class UserController {
  private static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  public static getRegister = (req: Request, res: Response) => {
    try {
      res.render('pages/user/register', { pageTitle: t('action.register') });
    } catch (error) {
      req.flash('error_msg', t('error.registerFail'));
      res.redirect('/error');
    }
  };
  public static getLogin = (req: Request, res: Response) => {
    try {
      res.render('pages/user/login', { pageTitle: t('action.login') });
    } catch (error) {
      req.flash('error_msg', t('noPageLogin'));
      res.redirect('/error');
    }
  };
  public static checkUsername = async (req: Request, res: Response) => {
    const username = req.body.username;
    try {
      const user = await UserService.findByUsername(username);
      if (user) {
        return res
          .status(400)
          .json({ message: t('error.usernameAlreadyTaken') });
      }
      res.status(200).json({ message: t('message.usernameAvailable') });
    } catch (error) {
      return res.status(404).json({ message: t('error.system') });
    }
  };
  public static postRegister = async (req: Request, res: Response) => {
    const data = req.body;
    const password = req.body.password;
    try {
      const user = await UserService.findByUsername(data.username);
      if (user) {
        req.flash('error_msg', t('error.usernameAlreadyTaken'));
        res.redirect('/register');
      }
      // Mã hóa mật khẩu trước khi lưu
      const hashedPassword = await hashPassword(password);
      // Thay thế mật khẩu gốc bằng mật khẩu đã mã hóa
      data.password = hashedPassword;
      data.role = UserRoles.User;
      const isValue = await UserService.create(data);
      if (!isValue) {
        req.flash('error_msg', t('error.createFail'));
        return res.redirect('/register');
      }
      return res.redirect('/login');
    } catch (error) {
      req.flash('error_msg', t('error.createFail'));
      res.redirect('/error');
    }
  };

  public static postLogin = async (req: Request, res: Response) => {
    const { usernameLogin, password } = req.body;
    try {
      const user = await UserService.findByUsername(usernameLogin);
      if (!user) {
        req.flash('error_msg', t('error.usernameNotFound'));
        return res.redirect('/login');
      }

      const isMatch = await comparePassword(password, user.password);

      if (!isMatch) {
        req.flash('error_msg', t('error.passwordIncorrect'));
        return res.redirect('/login');
      }
      if (user.status === UserStatus.Deactive) {
        req.flash('error_msg', t('error.accountLocked'));
        return res.redirect('/login');
      }
      // Xử lý đăng nhập thành công
      (req.session as any).user = user;
      if (user.role === UserRoles.User) {
        res.redirect('/user');
      } else {
        return res.redirect('/admin');
      }
    } catch (error) {
      req.flash('error_msg', t('error.loginFail'));
      res.redirect('/error');
    }
  };

  // Đăng xuất người dùng
  public static logout = (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        req.flash('error_msg', t('error.logoutFail'));
      } else {
        res.redirect('/login');
      }
    });
  };

  public static getHomeUser = async (req: Request, res: Response) => {
    const user = res.locals.user;
    if (user) {
      const authors = await getAuthors();
      const albums = await getAlbums();
      const songs = await getAllSongs(req, user?.role);

      const likedSongPlaylist = await getPlaylistByUserIdAndTitle(
        user.id,
        t(`likedSong.${PlaylistTitle.LikedSong}`)
      );
      if (!likedSongPlaylist) {
        const songsByLikedSong = {};
        return res.render('pages/home', {
          authors,
          albums,
          songs,
          title: t('title'),
          user: user,
          songsByLikedSong: songsByLikedSong,
        });
      }
      const songsByLikedSong = await getSongsByPlaylistId(likedSongPlaylist.id);
      return res.render('pages/home', {
        authors,
        albums,
        songs,
        title: t('title'),
        user: user,
        songsByLikedSong,
      });
    } else {
      res.redirect('/login');
    }
  };
  public static getAccoutPage = (req: Request, res: Response) => {
    const user = req.session.user;
    if (user) {
      return res.render('user.account/index', {
        title: t('title'),
        user: user,
      });
    } else {
      res.redirect('/login');
    }
  };
  public static getEditProfile = async (req: Request, res: Response) => {
    const user = req.session.user;
    const { id } = req.params;
    try {
      const userForm = await UserService.findById(parseInt(id));
      if (!userForm) {
        req.flash('error_msg', t('error.userNotFound'));
        return res.redirect('/login');
      }
      const dateOfBirth = formatDateYMD(userForm.user_dateOfBirth);
      return res.render('user.account/edit_profile', {
        title: t('title'),
        userForm: userForm,
        dateOfBirth,
        user: user,
      });
    } catch (error) {
      res.redirect('/login');
    }
  };
  public static postEditProfile = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userData: Partial<User> = req.body;
    try {
      const success = await UserService.update(parseInt(id), userData);
      if (!success) {
        req.flash('error_msg', t('error.updateFail'));
        return res.redirect(`/user/account/edit-profile/${id}`);
      }
      req.flash('success_msg', t('message.successfullyUpdated'));
      return res.redirect(`/user/account/edit-profile/${id}`);
    } catch (error) {
      req.flash('error_msg', t('error.updateFail'));
      res.redirect('/error');
    }
  };

  public static getChangePassword = async (req: Request, res: Response) => {
    const user = req.session.user;
    const { id } = req.params;
    try {
      const userForm = await UserService.findById(parseInt(id));
      if (!userForm) {
        req.flash('error_msg', t('error.userNotFound'));
        return res.redirect('/login');
      }
      const dateOfBirth = formatDateYMD(userForm.user_dateOfBirth);
      return res.render('user.account/change_password', {
        title: t('title'),
        user: user,
        userForm,
        dateOfBirth,
      });
    } catch (error) {
      req.flash('error_msg', t('error.userNotFound'));
      res.redirect('/login');
    }
  };

  public static checkPassword = async (req: Request, res: Response) => {
    const user = req.session.user;
    const currentPass = req.body.currentPassword;
    try {
      if (!user) {
        return res.status(400).json({ message: t('error.usernameNotFound') });
      }
      if (!currentPass) {
        return res.status(400).json({ message: t('error.passwordNotFound') });
      }
      const isMatch = await comparePassword(currentPass, user?.password);

      if (!isMatch) {
        return res.status(400).json({ message: t('error.passwordIncorrect') });
      }
      return res.status(200).json({ isValid: true });
    } catch (error) {
      return res.status(500).json({ message: t('error.system') });
    }
  };

  public static postChangePassword = async (req: Request, res: Response) => {
    const user = res.locals.user;
    const { id } = req.params;
    const newPassword = req.body.newPassword;
    const confirmNewPassword = req.body.confirmNewPassword;
    if (!user || !user.email) {
      req.flash('error_msg', t('error.userNotFound'));
      return res.redirect('/login');
    }
    try {
      if (!newPassword || newPassword !== confirmNewPassword) {
        req.flash('error_msg', t('error.passwordIncorrect'));
        return res.redirect(`/user/account/change-password/${id}`);
      }
      const userForm = await UserService.findById(parseInt(id));
      if (!userForm) {
        req.flash('error_msg', t('error.userNotFound'));
        return res.redirect('/user/account');
      }
      (req.session as any).newPassword = newPassword;
      res.redirect(`/user/account/change-password/OTP/${id}`);
    } catch (error) {
      req.flash('error_msg', t('error.system'));
      res.redirect('/login');
    }
  };

  public static getInputOTP = async (req: Request, res: Response) => {
    const user = res.locals.user;
    const { id } = req.params;
    try {
      const userForm = await UserService.findById(parseInt(id));
      if (!userForm) {
        req.flash('error_msg', t('error.userNotFound'));
        return res.redirect('/user/account');
      }
      const otp = UserController.generateOTP();
      (req.session as any).otp = otp;
      const dataSend = {
        username: userForm.user_username,
        otp: otp,
      };
      await sendEmailNormal(
        user.email,
        transOTPEmail.subject,
        transOTPEmail.template(dataSend)
      );
      res.render('user.account/inputOTP', { user });
    } catch (error) {
      req.flash('error_msg', t('error.system'));
      res.redirect('/login');
    }
  };

  public static putChangePassword = async (req: Request, res: Response) => {
    const { id } = req.params;
    const otpDigits = [
      req.body.otpDigit0,
      req.body.otpDigit1,
      req.body.otpDigit2,
      req.body.otpDigit3,
      req.body.otpDigit4,
      req.body.otpDigit5,
    ];
    // Kết hợp các giá trị thành một chuỗi OTP
    const otp = otpDigits.join('');
    const otpMail = res.locals.otp;
    const newPassword = res.locals.newPassword;
    try {
      if (otp !== otpMail) {
        req.flash('error_msg', t('error.OTPIncorrect'));
        return res.redirect(`/user/account/change-password/OTP/${id}`);
      }
      const hashedPassword = await hashPassword(newPassword);
      const updateResult = await UserService.update(parseInt(id), {
        password: hashedPassword,
      });
      if (!updateResult) {
        req.flash('error_msg', t('error.updateFail'));
        return res.redirect(`/user/account/change-password/${id}`);
      }

      req.flash('success_msg', t('success.passwordChangedSuccessfully'));
      res.redirect(`/user/account/change-password/${id}`);
    } catch (error) {
      req.flash('error_msg', t('error.system'));
      res.redirect('/login');
    }
  };

  public static getSuggestSong = async (req: Request, res: Response) => {
    const user = res.locals.user;
    try {
      const authors = await getAuthors();
      const genres = await getGenres();
      res.render('pages/suggest_song', {
        authors,
        genres,
        title: req.t('title'),
        user,
      });
    } catch (error) {
      res.redirect('/login');
    }
  };

  public static postSuggestSong = async (req: Request, res: Response) => {
    const user = res.locals.user;
    const title = req.body.title;
    const artistName = req.body.authorId;
    const lyrics = req.body.lyrics;
    const genresIds = req.body.genresIds;
    try {
      let imageUrl = '';
      let url = '';
      let author;
      if (/^\d+$/.test(artistName)) {
        // artistName là một chuỗi số
        author = await getAuthorById(parseInt(artistName), req.t);
      } else {
        author = await getAuthorByFullName(artistName);
      }
      if (!author) {
        author = await createAuthor(
          {
            fullname: artistName,
            avatar: Change.imageUrl,
            dateOfBirth: new Date(),
          },
          req.t
        );
      }
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (files.image && files.image.length > 0) {
        const image = files.image[0];
        imageUrl = await uploadFileToFirebase(
          image.buffer,
          image.originalname,
          'musics/images',
          image.mimetype
        );
      }
      if (files.song && files.song.length > 0) {
        const song = files.song[0];
        url = await uploadFileToFirebase(
          song.buffer,
          song.originalname,
          'musics/songs',
          song.mimetype
        );
      }
      const genres = await getGenresByIds(genresIds);
      const status = SongStatus.Suggesting;
      const newSong = await createSong(req, {
        title,
        artist: author.id.toString(),
        lyrics,
        imageUrl,
        url,
        status,
        author,
        genres,
      });
      const suggestedSong = await createSuggestSong(user, newSong);
      if (!suggestedSong) {
        return res.status(400).json({
          status: false,
          message: t('error.failedToCreateSuggestSong'),
        });
      }
      const songAfter = await getSongById(req, newSong.id);
      const dataSend = {
        username: user.username,
        song: songAfter,
      };
      await sendEmailNormal(
        user.email,
        transSuggestSong.subject,
        transSuggestSong.template(dataSend)
      );
      return res.status(200).json({
        status: true,
        message: t('success.sendSuggestSongSuccess'),
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: false,
        message: t('error.system'),
      });
    }
  };

  public static sendSuggetSong = (req: Request, res: Response) => {
    const title = req.body.title;
    try {
      res.status(200).json({
        message: title,
      });
    } catch (error) {
      req.flash('error_msg', t('error.system'));
      console.log('error: ', error);
      res.redirect('/user/suggest-song');
    }
  };
}

export const showSectionArtist = async (req: Request, res: Response) => {
  const user = res.locals.user;
  try {
    const authors = await getAuthors();
    res.render('user.role/section/popularArtist', {
      authors,
      title: t('title'),
      user,
    });
  } catch (error) {
    res.redirect('/login');
  }
};

export const showSectionAlbum = async (req: Request, res: Response) => {
  const user = res.locals.user;
  try {
    const albums = await getAlbums();
    res.render('user.role/section/popularAlbum', {
      albums,
      title: t('title'),
      user,
    });
  } catch (error) {
    res.redirect('/login');
  }
};

export const showSectionSong = async (req: Request, res: Response) => {
  const user = res.locals.user;
  try {
    const songs = await getAllSongs(req, user?.role);
    const likedSongPlaylist = await getPlaylistByUserIdAndTitle(
      user.id,
      t(`likedSong.${PlaylistTitle.LikedSong}`)
    );
    if (!likedSongPlaylist) {
      const songsByLikedSong = {};
      return res.render('user.role/section/songNews', {
        songs,
        title: t('title'),
        user,
        songsByLikedSong,
      });
    }
    const songsByLikedSong = await getSongsByPlaylistId(likedSongPlaylist.id);
    res.render('user.role/section/songNews', {
      songs,
      title: t('title'),
      user,
      songsByLikedSong,
    });
  } catch (error) {
    res.redirect('/login');
  }
};
