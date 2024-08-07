import 'express-session';
declare module 'express-session' {
  interface SessionData {
    user?: {
      username: string;
      email: string;
      password: string;
      dateOfBirth: Date;
      role: string;
    };
  }
}
