import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { HttpException } from '@/exceptions/HttpException';
import { Admin } from '@prisma/client';
import { BaseService } from '@/services/base/base.service';
import bcrypt from 'bcryptjs';

/**
 * Service class for handling user-related operations.
 * Extends the base service for CRUD functionality specific to the User model.
 */
@Service()
export class AdminService extends BaseService<Admin> {
  /**
   * Constructor initializes the base service with the 'User' model name.
   */
  constructor() {
    super('Admin');
  }

  public query = this.prisma.admin;

  /**
   * Retrieves all users from the database.
   * @returns {Promise<User[]>} - A promise that resolves to an array of users.
   */
  public async findAll(): Promise<Admin[]> {
    return this.prisma.admin.findMany();
  }

  /**
   * Finds a user by their unique ID.
   * @param {string} userId - The ID of the user to find.
   * @returns {Promise<User>} - A promise that resolves to the found user or throws an exception if not found.
   * @throws {HttpException} - Throws an exception if the user does not exist.
   */
  public async findById(userId: string): Promise<Admin> {
    const findUser: Admin = await this.prisma.admin.findUnique({
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
  public async create(data: Admin): Promise<Admin> {
    // Check if user already exists by email
    const findUser: Admin = await this.prisma.admin.findUnique({
      where: { email: data.email },
    });

    if (findUser) throw new HttpException(409, `This email ${data.email} already exists`);

    // Hash the user's password
    const hashedPassword = await hash(data.password, 10);

    // Create the user with the hashed password
    delete data.id;
    const admin = await this.prisma.admin.create({
      data: { ...data, password: hashedPassword },
    });
    return admin;
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
  public async update(userId: string, data: Admin): Promise<Admin> {
    // Find the user by ID to ensure the user exists
    const findUser: Admin | null = await this.prisma.admin.findUnique({
      where: { id: userId },
    });

    // Throw an error if unable to find user with userId
    if (!findUser) {
      throw new HttpException(404, `User with ID ${userId} not found`);
    }

    // Check if another user exists with the same email but a different ID
    if (data.email && data.email.toLowerCase() !== findUser.email.toLowerCase()) {
      const existingUserWithEmail: Admin | null = await this.prisma.admin.findUnique({
        where: { email: data.email },
      });

      // Throw an error if an existing user with the same email is found
      if (existingUserWithEmail) {
        throw new HttpException(409, `Email ${data.email} is already in use by another user`);
      }
    }

    // Update the user with new data
    return await this.prisma.admin.update({
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
  public async delete(userIds: string[]): Promise<boolean> {
    // Attempt to delete users with the provided IDs
    const result = await this.prisma.admin.deleteMany({
      where: {
        id: { in: userIds },
        isSystem: 0,
      },
    });

    // Throw an error if no users were deleted
    if (!result.count) throw new HttpException(409, "User doesn't exist");

    return true;
  }

  // Update admin profile
  public async updateProfile(adminId: string, name: string, email: string): Promise<Admin> {
    return this.prisma.admin.update({
      where: { id: adminId },
      data: { name, email },
    });
  }

  // Update admin password
  public async updatePassword(adminId: string, currentPassword: string, newPassword: string): Promise<void> {
    const admin = await this.prisma.admin.findUnique({ where: { id: adminId } });

    if (!admin) {
      throw new Error('Admin not found');
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }

    const isNewMatch = await bcrypt.compare(newPassword, admin.password);
    if (isNewMatch) {
      throw new Error('New password is already used in the past');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.admin.update({
      where: { id: adminId },
      data: { password: hashedPassword },
    });
  }

  public async updatePasswordWithoutCurrent(adminId: string, newPassword: string): Promise<void> {
    const admin = await this.prisma.admin.findUnique({ where: { id: adminId } });

    if (!admin) {
      throw new Error('Admin not found');
    }

    const isNewMatch = await bcrypt.compare(newPassword, admin.password);
    if (isNewMatch) {
      throw new Error('New password is already used in the past');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.admin.update({
      where: { id: adminId },
      data: { password: hashedPassword },
    });
  }
}
