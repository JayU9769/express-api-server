"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const tslib_1 = require("tslib");
const bcrypt_1 = require("bcrypt");
const typedi_1 = require("typedi");
const HttpException_1 = require("@/exceptions/HttpException");
const base_service_1 = require("@/services/base/base.service");
const bcryptjs_1 = tslib_1.__importDefault(require("bcryptjs"));
/**
 * Service class for handling user-related operations.
 * Extends the base service for CRUD functionality specific to the User model.
 */
let UserService = class UserService extends base_service_1.BaseService {
    /**
     * Constructor initializes the base service with the 'User' model name.
     */
    constructor() {
        super('User');
        this.query = this.prisma.user;
    }
    /**
     * Retrieves all users from the database.
     * @returns {Promise<User[]>} - A promise that resolves to an array of users.
     */
    async findAll() {
        return this.prisma.user.findMany();
    }
    /**
     * Finds a user by their unique ID.
     * @param {string} userId - The ID of the user to find.
     * @returns {Promise<User>} - A promise that resolves to the found user or throws an exception if not found.
     * @throws {HttpException} - Throws an exception if the user does not exist.
     */
    async findById(userId) {
        const findUser = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!findUser)
            throw new HttpException_1.HttpException(409, "User doesn't exist");
        return findUser;
    }
    /**
     * Creates a new user with the provided data.
     * Hashes the password before saving the user in the database.
     * @param {User} data - The user data to create.
     * @returns {Promise<User>} - A promise that resolves to the created user.
     * @throws {HttpException} - Throws an exception if the email already exists.
     */
    async create(data) {
        // Check if user already exists by email
        const findUser = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (findUser)
            throw new HttpException_1.HttpException(409, `This email ${data.email} already exists`);
        // Hash the user's password
        const hashedPassword = await (0, bcrypt_1.hash)(data.password, 10);
        // Create the user with the hashed password
        delete data.id;
        return this.prisma.user.create({
            data: Object.assign(Object.assign({}, data), { password: hashedPassword }),
        });
    }
    /**
     * Updates an existing user by their ID with the provided data.
     * If the password is updated, it is hashed before saving.
     * Validates that the email is unique across users.
     * @param {string} userId - The ID of the user to update.
     * @param {User} data - The new data for the user.
     * @returns {Promise<User>} - A promise that resolves to the updated user.
     * @throws {HttpException} - Throws an exception if the email already exists for a different user.
     * @throws {HttpException} - Throws an exception if the user with the provided ID is not found.
     */
    async update(userId, data) {
        // Find the user by ID to ensure the user exists
        const findUser = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        // Throw an error if unable to find user with userId
        if (!findUser) {
            throw new HttpException_1.HttpException(404, `User with ID ${userId} not found`);
        }
        // Check if another user exists with the same email but a different ID
        if (data.email && data.email.toLowerCase() !== findUser.email.toLowerCase()) {
            const existingUserWithEmail = await this.prisma.user.findUnique({
                where: { email: data.email },
            });
            // Throw an error if an existing user with the same email is found
            if (existingUserWithEmail) {
                throw new HttpException_1.HttpException(409, `Email ${data.email} is already in use by another user`);
            }
        }
        // Hash the new password if provided
        if (data.password) {
            const hashedPassword = await (0, bcrypt_1.hash)(data.password, 10);
            data = Object.assign(Object.assign({}, data), { password: hashedPassword });
        }
        // Update the user with new data
        return this.prisma.user.update({
            where: { id: userId },
            data: data,
        });
    }
    /**
     * Deletes users by their IDs.
     * @param {string[]} userIds - An array of user IDs to delete.
     * @returns {Promise<boolean>} - A promise that resolves to true if users were successfully deleted.
     * @throws {HttpException} - Throws an exception if no users were deleted.
     */
    async delete(userIds) {
        // Attempt to delete users with the provided IDs
        const result = await this.prisma.user.deleteMany({
            where: {
                id: { in: userIds },
            },
        });
        // Throw an error if no users were deleted
        if (!result.count)
            throw new HttpException_1.HttpException(409, "User doesn't exist");
        return true;
    }
    async updatePasswordWithoutCurrent(userId, newPassword) {
        const admin = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!admin) {
            throw new Error('Admin not found');
        }
        const isNewMatch = await bcryptjs_1.default.compare(newPassword, admin.password);
        if (isNewMatch) {
            throw new Error('New password is already used in the past');
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__metadata("design:paramtypes", [])
], UserService);
//# sourceMappingURL=user.service.js.map