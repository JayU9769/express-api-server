import { Service } from 'typedi';
import { HttpException } from '@/exceptions/HttpException';
import { Role } from '@prisma/client';
import { BaseService } from "@/services/base/base.service";

/**
 * Service class for handling role-related operations.
 * Extends the base service for CRUD functionality specific to the Role model.
 */
@Service()
export class RoleService extends BaseService<Role> {

  /**
   * Constructor initializes the base service with the 'Role' model name.
   */
  constructor() {
    super('Role');
  }

  /**
   * Retrieves all roles from the database.
   * @returns {Promise<Role[]>} - A promise that resolves to an array of roles.
   */
  public async findAll(): Promise<Role[]> {
    return this.prisma.role.findMany();
  }

  /**
   * Finds a role by its unique ID.
   * @param {number} roleId - The ID of the role to find.
   * @returns {Promise<Role>} - A promise that resolves to the found role or throws an exception if not found.
   * @throws {HttpException} - Throws an exception if the role does not exist.
   */
  public async findById(roleId: number): Promise<Role> {
    const findRole: Role = await this.prisma.role.findUnique({
      where: { id: roleId },
    });
    if (!findRole) throw new HttpException(409, "Role doesn't exist");

    return findRole;
  }

  /**
   * Creates a new role with the provided data.
   * @param {Role} data - The role data to create.
   * @returns {Promise<Role>} - A promise that resolves to the created role.
   * @throws {HttpException} - Throws an exception if the role name already exists.
   */
  public async create(data: Role): Promise<Role> {
    // Check if the role already exists by name
    const findRole: Role = await this.prisma.role.findUnique({
      where: { name: data.name },
    });
    if (findRole) throw new HttpException(409, `This role ${data.name} already exists`);

    // Create the new role
    return this.prisma.role.create({ data });
  }

  /**
   * Updates an existing role by its ID with the provided data.
   * Validates that the role name is unique across roles.
   * @param {number} roleId - The ID of the role to update.
   * @param {Role} data - The new data for the role.
   * @returns {Promise<Role>} - A promise that resolves to the updated role.
   * @throws {HttpException} - Throws an exception if the role name already exists for a different role.
   * @throws {HttpException} - Throws an exception if the role with the provided ID is not found.
   */
  public async update(roleId: number, data: Role): Promise<Role> {
    // Find the role by ID to ensure the role exists
    const findRole: Role | null = await this.prisma.role.findUnique({
      where: { id: roleId },
    });

    // Throw an error if unable to find role with roleId
    if (!findRole) {
      throw new HttpException(404, `Role with ID ${roleId} not found`);
    }

    // Check if another role exists with the same name but a different ID
    if (data.name && data.name.toLowerCase() !== findRole.name.toLowerCase()) {
      const existingRoleWithName: Role | null = await this.prisma.role.findUnique({
        where: { name: data.name },
      });

      // Throw an error if an existing role with the same name is found
      if (existingRoleWithName) {
        throw new HttpException(409, `Role name ${data.name} is already in use by another role`);
      }
    }

    // Update the role with new data
    return this.prisma.role.update({
      where: { id: roleId },
      data: data,
    });
  }

  /**
   * Deletes roles by their IDs.
   * @param {number[]} roleIds - An array of role IDs to delete.
   * @returns {Promise<boolean>} - A promise that resolves to true if roles were successfully deleted.
   * @throws {HttpException} - Throws an exception if no roles were deleted.
   */
  public async delete(roleIds: number[]): Promise<boolean> {
    // Attempt to delete roles with the provided IDs
    const result = await this.prisma.role.deleteMany({
      where: {
        id: { in: roleIds },
      },
    });

    // Throw an error if no roles were deleted
    if (!result.count) throw new HttpException(409, "Role doesn't exist");

    return true;
  }
}
