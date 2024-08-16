import { formatDateYMD } from '@src/utils/formatDate';
import UserService from '@src/services/user.service';
import { Request, Response } from 'express';
import { t } from 'i18next';
import { comparePassword, hashPassword } from '@src/utils/passwordUtils';
import { UserRoles, UserStatus } from '@src/enums/UserRoles.enum';
import { User } from '@src/entities/User.entity';
import { getAuthors } from '@src/services/Author.service';
import { getAlbums } from '@src/services/Album.service';
import { songsSortByUpdatedAt } from '@src/services/Song.service';

export class UserController {
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
    const user = req.session.user;
    if (user) {
      const authors = await getAuthors();
      const albums = await getAlbums();
      const songs = await songsSortByUpdatedAt(req);
      return res.render('pages/home', {
        authors,
        albums,
        songs,
        title: t('title'),
        user: user,
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
}
