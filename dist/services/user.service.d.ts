import { User } from '@prisma/client';
import { BaseService } from '@/services/base/base.service';
/**
 * Service class for handling user-related operations.
 * Extends the base service for CRUD functionality specific to the User model.
 */
export declare class UserService extends BaseService<User> {
    /**
     * Constructor initializes the base service with the 'User' model name.
     */
    constructor();
    query: import(".prisma/client").Prisma.UserDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    /**
     * Retrieves all users from the database.
     * @returns {Promise<User[]>} - A promise that resolves to an array of users.
     */
    findAll(): Promise<User[]>;
    /**
     * Finds a user by their unique ID.
     * @param {string} userId - The ID of the user to find.
     * @returns {Promise<User>} - A promise that resolves to the found user or throws an exception if not found.
     * @throws {HttpException} - Throws an exception if the user does not exist.
     */
    findById(userId: string): Promise<User>;
    /**
     * Creates a new user with the provided data.
     * Hashes the password before saving the user in the database.
     * @param {User} data - The user data to create.
     * @returns {Promise<User>} - A promise that resolves to the created user.
     * @throws {HttpException} - Throws an exception if the email already exists.
     */
    create(data: User): Promise<User>;
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
    update(userId: string, data: User): Promise<User>;
    /**
     * Deletes users by their IDs.
     * @param {string[]} userIds - An array of user IDs to delete.
     * @returns {Promise<boolean>} - A promise that resolves to true if users were successfully deleted.
     * @throws {HttpException} - Throws an exception if no users were deleted.
     */
    delete(userIds: string[]): Promise<boolean>;
    updatePasswordWithoutCurrent(userId: string, newPassword: string): Promise<void>;
}
