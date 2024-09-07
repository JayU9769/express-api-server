import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { HttpException } from '@/exceptions/HttpException';
import { User } from '@prisma/client';
import { BaseService } from "@/services/base/base.service";

/**
 * Service class for handling user-related operations.
 * Extends the base service for CRUD functionality specific to the User model.
 */
@Service()
export class UserService extends BaseService<User> {

  /**
   * Constructor initializes the base service with the 'User' model name.
   */
  constructor() {
    super('User');
  }

  /**
   * Retrieves all users from the database.
   * @returns {Promise<User[]>} - A promise that resolves to an array of users.
   */
  public async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  /**
   * Finds a user by their unique ID.
   * @param {number} userId - The ID of the user to find.
   * @returns {Promise<User>} - A promise that resolves to the found user or throws an exception if not found.
   * @throws {HttpException} - Throws an exception if the user does not exist.
   */
  public async findById(userId: number): Promise<User> {
    const findUser: User = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  /**
   * Creates a new user with the provided data.
   * Hashes the password before saving the user in the database.
   * @param {User} data - The user data to create.
   * @returns {Promise<User>} - A promise that resolves to the created user.
   * @throws {HttpException} - Throws an exception if the email already exists.
   */
  public async create(data: User): Promise<User> {
    // Check if user already exists by email
    const findUser: User = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (findUser) throw new HttpException(409, `This email ${data.email} already exists`);

    // Hash the user's password
    const hashedPassword = await hash(data.password, 10);

    // Create the user with the hashed password
    return this.prisma.user.create({
      data: { ...data, password: hashedPassword },
    });
  }
  /**
   * Updates an existing user by their ID with the provided data.
   * If the password is updated, it is hashed before saving.
   * Validates that the email is unique across users.
   * @param {number} userId - The ID of the user to update.
   * @param {User} data - The new data for the user.
   * @returns {Promise<User>} - A promise that resolves to the updated user.
   * @throws {HttpException} - Throws an exception if the email already exists for a different user.
   * @throws {HttpException} - Throws an exception if the user with the provided ID is not found.
   */
  public async update(userId: number, data: User): Promise<User> {
    // Find the user by ID to ensure the user exists
    const findUser: User | null = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    // Throw an error if unable to find user with userId
    if (!findUser) {
      throw new HttpException(404, `User with ID ${userId} not found`);
    }

    // Check if another user exists with the same email but a different ID
    if (data.email && data.email.toLowerCase() !== findUser.email.toLowerCase()) {
      const existingUserWithEmail: User | null = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      // Throw an error if an existing user with the same email is found
      if (existingUserWithEmail) {
        throw new HttpException(409, `Email ${data.email} is already in use by another user`);
      }
    }

    // Hash the new password if provided
    if (data.password) {
      const hashedPassword = await hash(data.password, 10);
      data = { ...data, password: hashedPassword };
    }

    // Update the user with new data
    return this.prisma.user.update({
      where: { id: userId },
      data: data,
    });
  }

  /**
   * Deletes users by their IDs.
   * @param {number[]} userIds - An array of user IDs to delete.
   * @returns {Promise<boolean>} - A promise that resolves to true if users were successfully deleted.
   * @throws {HttpException} - Throws an exception if no users were deleted.
   */
  public async delete(userIds: number[]): Promise<boolean> {
    // Attempt to delete users with the provided IDs
    const result = await this.prisma.user.deleteMany({
      where: {
        id: { in: userIds },
      },
    });

    // Throw an error if no users were deleted
    if (!result.count) throw new HttpException(409, "User doesn't exist");

    return true;
  }
}
