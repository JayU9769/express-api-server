"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const user_service_1 = require("@/services/user.service");
const HttpException_1 = require("@/exceptions/HttpException");
/**
 * Controller handling user-related HTTP requests.
 */
class UserController {
    constructor() {
        this.user = typedi_1.Container.get(user_service_1.UserService);
        /**
         * Retrieves a paginated list of users based on query parameters.
         * Supports pagination, filtering, sorting, and search.
         * @method get
         * @param req Express request object
         * @param res Express response object
         * @param next Express next function for error handling
         */
        this.getUsers = async (req, res, next) => {
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
                // Fetch paginated user data
                const findAllUsersData = await this.user.findAllPaginate(options);
                // Respond with the fetched data
                res.status(200).json({ data: findAllUsersData, message: 'findAll' });
            }
            catch (error) {
                // Pass any errors to the next error handling middleware
                next(error);
            }
        };
        /**
         * Retrieves a single user by their ID.
         * @method get
         * @param req Express request object with user ID in params
         * @param res Express response object
         * @param next Express next function for error handling
         */
        this.getUserById = async (req, res, next) => {
            try {
                const userId = req.params.id;
                // Find user by ID
                const findOneUserData = await this.user.findById(userId);
                // Respond with the fetched user data
                res.status(200).json({ data: findOneUserData, message: 'findOne' });
            }
            catch (error) {
                // Pass any errors to the next error handling middleware
                next(error);
            }
        };
        /**
         * Creates a new user with provided data.
         * @method post
         * @param req Express request object with user data in body
         * @param res Express response object
         * @param next Express next function for error handling
         */
        this.createUser = async (req, res, next) => {
            try {
                const userData = req.body;
                // Create new user
                const createUserData = await this.user.create(userData);
                // Respond with the created user data
                res.status(201).json({ data: createUserData, message: 'created' });
            }
            catch (error) {
                // Pass any errors to the next error handling middleware
                next(error);
            }
        };
        /**
         * Updates an existing user with provided data.
         * @method put
         * @param req Express request object with user ID in params and user data in body
         * @param res Express response object
         * @param next Express next function for error handling
         */
        this.updateUser = async (req, res, next) => {
            try {
                const userId = req.params.id;
                const userData = req.body;
                // Update user by ID
                const updateUserData = await this.user.update(userId, userData);
                // Respond with the updated user data
                res.status(200).json({ data: updateUserData, message: 'updated' });
            }
            catch (error) {
                // Pass any errors to the next error handling middleware
                next(error);
            }
        };
        /**
         * Deletes a user by their ID.
         * @method delete
         * @param req Express request object with user ID in params
         * @param res Express response object
         * @param next Express next function for error handling
         */
        this.deleteUser = async (req, res, next) => {
            try {
                const userIds = req.body.ids;
                // Delete user by ID
                await this.user.delete(userIds);
                // Respond with success message
                res.status(200).json({ message: 'deleted' });
            }
            catch (error) {
                // Pass any errors to the next error handling middleware
                next(error);
            }
        };
        /**
         * Single action a users by their ID & Type.
         * @method post
         * @param req Express request object with user ID in params
         * @param res Express response object
         * @param next Express next function for error handling
         */
        this.updateAction = async (req, res, next) => {
            try {
                const { ids, field } = req.body;
                await this.user.updateAction({ ids, field });
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
                const userId = req.params.id;
                // Check if newPassword and confirmNewPassword match
                if (newPassword !== confirmNewPassword) {
                    throw new HttpException_1.HttpException(422, 'New password and confirm password do not match');
                }
                await this.user.updatePasswordWithoutCurrent(userId, newPassword);
                res.status(200).json({ message: 'Password updated successfully' });
            }
            catch (error) {
                next(error); // Pass any errors to the error handling middleware
            }
        };
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map