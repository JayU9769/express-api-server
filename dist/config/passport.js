"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passport = exports.PassportService = void 0;
const tslib_1 = require("tslib");
const passport_1 = tslib_1.__importDefault(require("passport"));
exports.passport = passport_1.default;
const passport_local_1 = require("passport-local");
const bcryptjs_1 = tslib_1.__importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const HttpException_1 = require("@/exceptions/HttpException");
const prisma = new client_1.PrismaClient();
/**
 * A singleton service class to manage Passport configuration and strategies.
 * It ensures that Passport is initialized only once and manages user authentication.
 */
class PassportService {
    /**
     * Private constructor to prevent direct instantiation.
     */
    constructor() {
        this.initialize();
    }
    /**
     * Gets the singleton instance of the PassportService class.
     * @returns The singleton instance of PassportService.
     */
    static getInstance() {
        if (!PassportService.instance) {
            PassportService.instance = new PassportService();
        }
        return PassportService.instance;
    }
    /**
     * Initializes Passport strategies and serialization/deserialization logic.
     */
    initialize() {
        passport_1.default.use('admin-local', new passport_local_1.Strategy({ usernameField: 'email' }, async (email, password, done) => {
            try {
                const admin = await prisma.admin.findUnique({
                    where: { email },
                });
                if (!admin) {
                    return done(new HttpException_1.HttpException(401, 'No admin with that email'), null);
                }
                if (!admin.status) {
                    return done(new HttpException_1.HttpException(401, 'Account has been deactivated!'), null);
                }
                const isMatch = await bcryptjs_1.default.compare(password, admin.password);
                if (!isMatch) {
                    return done(new HttpException_1.HttpException(401, 'Provided password is invalid'), null);
                }
                const roles = await prisma.modelHasRole.findMany({
                    where: {
                        modelId: admin.id,
                        modelType: client_1.UserType.admin,
                    },
                    include: {
                        role: {
                            include: {
                                roleHasPermissions: {
                                    include: {
                                        permission: true, // Including the permission object
                                    },
                                },
                            },
                        },
                    },
                });
                const userRoles = [];
                const permissions = roles.flatMap(userRole => {
                    userRoles.push(userRole.role.name);
                    return userRole.role.roleHasPermissions.map(rp => rp.permission.name);
                });
                const { password: _ } = admin, rest = tslib_1.__rest(admin, ["password"]);
                return done(null, Object.assign(Object.assign({}, rest), { roles: userRoles, permissions }));
            }
            catch (error) {
                return done(new HttpException_1.HttpException(500, 'Internal server error'), null);
            }
        }));
        passport_1.default.serializeUser((user, done) => {
            const { password } = user, rest = tslib_1.__rest(user, ["password"]);
            done(null, rest);
        });
        passport_1.default.deserializeUser(async (admin, done) => {
            try {
                // const admin = await prisma.admin.findUnique({ where: { id } });
                if (admin) {
                    return done(null, admin);
                }
                // const user = await prisma.user.findUnique({ where: { id } });
                // if (user) {
                //   return done(null, user);
                // }
                done(new HttpException_1.HttpException(404, 'User not found'), null);
            }
            catch (error) {
                done(new HttpException_1.HttpException(500, 'Internal server error'), null);
            }
        });
    }
}
exports.PassportService = PassportService;
PassportService.instance = null;
//# sourceMappingURL=passport.js.map