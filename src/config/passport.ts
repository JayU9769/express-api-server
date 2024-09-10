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
        const admin = await prisma.admin.findUnique({
          where: { email },
          // include: {
          //   modelHasRoles: {
          //     include: {
          //       role: {
          //         include: {
          //           roleHasPermissions: {
          //             include: { permission: true },
          //           },
          //         },
          //       },
          //     },
          //   },
          // },
        });
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
        // const roles = admin.modelHasRoles.map(r => r.role.name);
        // const permissions = admin.modelHasRoles.flatMap(r => r.role.roleHasPermissions.map(p => p.permission.name));
        // const adminWithRolesAndPermissions = {
        //   ...rest,
        //   roles,
        //   permissions,
        // };
        const { password: asPass, ...rest } = admin;
        return done(null, rest as Admin);
      } catch (error) {
        return done(new HttpException(500, 'Internal server error'), null);
      }
    }),
  );

  passport.serializeUser((user: Admin | User, done) => {
    const { password, ...rest } = user;
    done(null, rest);
  });

  passport.deserializeUser(async (admin: Admin | User, done) => {
    try {
      // const admin = await prisma.admin.findUnique({ where: { id } });
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
