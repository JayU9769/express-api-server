"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const tslib_1 = require("tslib");
const HttpException_1 = require("@/exceptions/HttpException");
const passport_1 = require("@/config/passport");
const typedi_1 = require("typedi");
const admin_service_1 = require("@/services/admin.service");
const client_1 = require("@prisma/client");
const RolePermissionService_1 = tslib_1.__importDefault(require("@/role-permissions/RolePermissionService"));
const permission_service_1 = require("@/services/permission.service");
/**
 * Controller handling admin-related HTTP requests.
 */
class AdminController {
    constructor() {
        // Initialize the AdminService via dependency injection
        this.admin = typedi_1.Container.get(admin_service_1.AdminService);
        this.rolePermissionService = typedi_1.Container.get(RolePermissionService_1.default);
        this.permissionService = typedi_1.Container.get(permission_service_1.PermissionService);
        /**
         * @description Handles admin login functionality using Passport's local strategy.
         * @param req - Express request object.
         * @param res - Express response object.
         * @param next - Express next function to pass control to the next middleware.
         * @returns A JSON response with a success message and admin data or an error.
         */
        this.login = async (req, res, next) => {
            passport_1.passport.authenticate('admin-local', (e, admin) => {
                if (e || !admin) {
                    return next(new HttpException_1.HttpException(401, 'Invalid credentials'));
                }
                req.login(admin, loginErr => {
                    if (loginErr) {
                        return next(new HttpException_1.HttpException(500, 'Login failed'));
                    }
                    return res.status(200).json({ message: 'Logged in successfully', data: admin });
                });
            })(req, res, next);
        };
        /**
         * @description Logs out the currently authenticated admin and clears the session cookie.
         * @param req - Express request object.
         * @param res - Express response object.
         * @returns A JSON response indicating successful logout or an error message.
         */
        this.logout = async (req, res) => {
            req.logout(e => {
                if (e) {
                    return res.status(500).json({ message: 'Error during logout' });
                }
                res.clearCookie('connect.sid'); // Clear session cookie
                return res.status(200).json({ message: 'Logged out successfully' });
            });
        };
        /**
         * @description Retrieves the profile of the currently authenticated admin.
         * @param req - Express request object.
         * @param res - Express response object.
         * @param next - Express next function to pass control to the next middleware.
         * @returns A JSON response with the admins profile data or an error message.
         */
        this.getProfile = async (req, res, next) => {
            if (!req.user) {
                return next(new HttpException_1.HttpException(401, 'Not authenticated'));
            }
            const admin = req.user;
            const permission = await this.permissionService.getPermissions();
            const mergedPermissions = admin.roles.reduce((acc, role) => {
                const permissions = permission[client_1.UserType.admin][role] || []; // Get permissions for the role or an empty array
                return [...acc, ...permissions]; // Merge permissions into accumulator
            }, []);
            // Remove duplicates using Set and return the result as an array
            req.user.permissions = [...new Set(mergedPermissions)];
            // Save the updated session
            req.session.save(err => {
                if (err) {
                    return next(err);
                }
            });
            return res.status(200).json({ message: 'Admin Profile', data: req.user });
        };
        /**
         * @description Updates the profile details of the currently authenticated admin.
         * @param req - Express request object.
         * @param res - Express response object.
         * @param next - Express next function to pass control to the next middleware.
         * @returns A JSON response with the updated admin data or an error message.
         */
        this.updateProfile = async (req, res, next) => {
            try {
                const { name, email } = req.body;
                const admin = req.user; // Extract the admins ID from req.admin
                const updatedAdmin = await this.admin.updateProfile(admin.id, name, email);
                // Update the session with the new profile data
                admin.name = updatedAdmin.name;
                admin.email = updatedAdmin.email;
                req.user = admin;
                // Save the updated session
                req.session.save(err => {
                    if (err) {
                        return next(err);
                    }
                });
                res.status(200).json({
                    message: 'Profile updated successfully',
                    data: updatedAdmin,
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * @description Updates the password of the currently authenticated admin.
         * @param req - Express request object.
         * @param res - Express response object.
         * @param next - Express next function to pass control to the next middleware.
         * @returns A JSON response indicating successful password update or an error message.
         */
        this.updatePassword = async (req, res, next) => {
            try {
                const { currentPassword, newPassword } = req.body;
                const adminId = req.user.id; // Extract the admins ID from req.admin
                await this.admin.updatePassword(adminId, currentPassword, newPassword);
                res.clearCookie('connect.sid'); // Clear session cookie
                res.status(200).json({ message: 'Password updated successfully' });
            }
            catch (error) {
                next(error); // Pass any errors to the error handling middleware
            }
        };
        /**
         * Retrieves a paginated list of admins based on query parameters.
         * Supports pagination, filtering, sorting, and search.
         * @method get
         * @param req Express request object
         * @param res Express response object
         * @param next Express next function for error handling
         */
        this.getAdmins = async (req, res, next) => {
            var _a;
            try {
                // Destructure query parameters with default values
                const _b = req.query, { pageNumber = 0, perPage = 10, sort = 'createdAt', order = 'ASC' } = _b, filters = tslib_1.__rest(_b, ["pageNumber", "perPage", "sort", "order"]);
                // Prepare options for pagination and filtering
                const options = {
                    pageNumber: Number(pageNumber) + 1,
                    perPage: Number(perPage),
                    filters: filters,
                    q: req.query.q,
                    ignoreGlobal: ((_a = req.query.ignoreGlobal) === null || _a === void 0 ? void 0 : _a.split(',')) || [],
                    sort: String(sort),
                    order: String(order).toUpperCase(),
                };
                // Fetch paginated admin data
                const findAllAdminsData = await this.admin.findAllPaginate(options);
                // Respond with the fetched data
                res.status(200).json({ data: findAllAdminsData, message: 'findAll' });
            }
            catch (error) {
                // Pass any errors to the next error handling middleware
                next(error);
            }
        };
        /**
         * Retrieves a single admin by their ID.
         * @method get
         * @param req Express request object with admin ID in params
         * @param res Express response object
         * @param next Express next function for error handling
         */
        this.getAdminById = async (req, res, next) => {
            try {
                const adminId = req.params.id;
                // Find admin by ID
                const findOneAdminData = await this.admin.findById(adminId);
                const roles = await this.rolePermissionService.getRoles(adminId, 'admin');
                // Respond with the fetched admin data
                res.status(200).json({ data: Object.assign(Object.assign({}, findOneAdminData), { roles: roles.map(role => role.id) }), message: 'findOne' });
            }
            catch (error) {
                // Pass any errors to the next error handling middleware
                next(error);
            }
        };
        /**
         * Creates a new admin with provided data.
         * @method post
         * @param req Express request object with admin data in body
         * @param res Express response object
         * @param next Express next function for error handling
         */
        this.createAdmin = async (req, res, next) => {
            try {
                const _a = req.body, { roles } = _a, rest = tslib_1.__rest(_a, ["roles"]);
                const adminData = rest;
                // Create new admin
                const createAdminData = await this.admin.create(adminData);
                if (roles.length > 0) {
                    this.rolePermissionService.syncRoles(createAdminData.id, roles, 'admin');
                }
                // Respond with the created admin data
                res.status(201).json({ data: createAdminData, message: 'created' });
            }
            catch (error) {
                // Pass any errors to the next error handling middleware
                next(error);
            }
        };
        /**
         * Updates an existing admin with provided data.
         * @method put
         * @param req Express request object with admin ID in params and admin data in body
         * @param res Express response object
         * @param next Express next function for error handling
         */
        this.updateAdmin = async (req, res, next) => {
            try {
                const adminId = req.params.id;
                const _a = req.body, { roles } = _a, rest = tslib_1.__rest(_a, ["roles"]);
                const adminData = rest;
                // // Update admin by ID
                const updateAdminData = await this.admin.update(adminId, adminData);
                if (roles.length > 0) {
                    this.rolePermissionService.syncRoles(adminId, roles, 'admin');
                }
                // Respond with the updated admin data
                res.status(200).json({ data: updateAdminData, message: 'updated' });
            }
            catch (error) {
                // Pass any errors to the next error handling middleware
                next(error);
            }
        };
        /**
         * Deletes a admin by their ID.
         * @method delete
         * @param req Express request object with admin ID in params
         * @param res Express response object
         * @param next Express next function for error handling
         */
        this.deleteAdmin = async (req, res, next) => {
            try {
                const adminIds = req.body.ids;
                // Delete admin by ID
                await this.admin.delete(adminIds);
                // Respond with success message
                res.status(200).json({ message: 'deleted' });
            }
            catch (error) {
                // Pass any errors to the next error handling middleware
                next(error);
            }
        };
        /**
         * Single action a admins by their ID & Type.
         * @method post
         * @param req Express request object with admin ID in params
         * @param res Express response object
         * @param next Express next function for error handling
         */
        this.updateAction = async (req, res, next) => {
            try {
                const { ids, field } = req.body;
                await this.admin.updateAction({ ids, field });
                // Respond with success message
                res.status(200).json({ message: 'Updated Bulk Action' });
            }
            catch (error) {
                // Pass any errors to the next error handling middleware
                next(error);
            }
        };
        this.updateAdminPassword = async (req, res, next) => {
            try {
                const { newPassword, confirmNewPassword } = req.body;
                const adminId = req.params.id;
                // Check if newPassword and confirmNewPassword match
                if (newPassword !== confirmNewPassword) {
                    return res.status(422).json({ error: 'New password and confirm password do not match' });
                }
                await this.admin.updatePasswordWithoutCurrent(adminId, newPassword);
                res.status(200).json({ message: 'Password updated successfully' });
            }
            catch (error) {
                next(error); // Pass any errors to the error handling middleware
            }
        };
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map