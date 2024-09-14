import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { Admin, PrismaClient, User } from '@prisma/client';
import { HttpException } from '@/exceptions/HttpException';

const prisma = new PrismaClient();

/**
 * A singleton service class to manage Passport configuration and strategies.
 * It ensures that Passport is initialized only once and manages user authentication.
 */
export class PassportService {
  private static instance: PassportService | null = null;

  /**
   * Private constructor to prevent direct instantiation.
   */
  private constructor() {
    this.initialize();
  }

  /**
   * Gets the singleton instance of the PassportService class.
   * @returns The singleton instance of PassportService.
   */
  public static getInstance(): PassportService {
    if (!PassportService.instance) {
      PassportService.instance = new PassportService();
    }
    return PassportService.instance;
  }

  /**
   * Initializes Passport strategies and serialization/deserialization logic.
   */
  private initialize(): void {
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

          const { password: _, ...rest } = admin;
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
  }
}

// Export the singleton instance of PassportService
export const passportService = PassportService.getInstance();
export { passport };
