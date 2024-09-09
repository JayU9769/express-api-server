import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { Admin, PrismaClient, User } from '@prisma/client';
import { HttpException } from '@/exceptions/HttpException';

const prisma = new PrismaClient();

const initializePassport = () => {
  passport.use(
    'admin-local',
    new LocalStrategy({ usernameField: 'email' }, async (email: string, password: string, done: (err: any, user?: Admin, info?: any) => void) => {
      try {
        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) {
          return done(new HttpException(401, 'No admin with that email'), null);
        }

        if (!admin.status) {
          return done(new HttpException(401, 'Account has been deactivated!'), null);
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
          return done(new HttpException(401, 'Provided password is invalid'), null);
        }
        delete admin.password;
        return done(null, admin);
      } catch (error) {
        return done(new HttpException(500, 'Internal server error'), null);
      }
    }),
  );

  passport.serializeUser((user: Admin | User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const admin = await prisma.admin.findUnique({ where: { id } });
      if (admin) {
        return done(null, admin);
      }

      // const user = await prisma.user.findUnique({ where: { id } });
      // if (user) {
      //   return done(null, user);
      // }

      done(new HttpException(404, 'User not found'), null);
    } catch (error) {
      done(new HttpException(500, 'Internal server error'), null);
    }
  });
};

export { initializePassport, passport };
