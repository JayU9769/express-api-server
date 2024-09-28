import {Service} from 'typedi';
import {HttpException} from '@/exceptions/HttpException';
import {Permission, Prisma, RoleHasPermission} from '@prisma/client';
import {BaseService} from '@/services/base/base.service';
import {EUserType} from "@/interfaces/global.interface";
import {IUpdatePermission} from "@/interfaces/permission.interface";

/**
 * Service class for handling permission-related operations.
 * Extends the base service for CRUD functionality specific to the Permission model.
 */
@Service()
export class PermissionService extends BaseService<Permission> {
  /**
   * Constructor initializes the base service with the 'Permission' model name.
   */
  constructor() {
    super('Permission');
  }

  public query = this.prisma.permission;

  /**
   * Retrieves all permissions from the database.
   * @returns {Promise<Permission[]>} - A promise that resolves to an array of permissions.
   */
  public async findAll(type?: EUserType): Promise<Permission[]> {
    const whereCondition: any = {}
    if (type) {
      whereCondition.type = type;
    }
    return this.prisma.permission.findMany({
      where: whereCondition
    });
  }

  public async findAllRoleHasPermissions(): Promise<RoleHasPermission[]> {
    return this.prisma.roleHasPermission.findMany();
  }

  public async updatePermission(data: IUpdatePermission) {
    const {role, value, permission} = data;

    // Find all permissions, including child permissions if no parentId
    const permissions = permission.parentId
      ? [permission]
      : await this.prisma.permission.findMany({where: {parentId: permission.id}});

    // Prepare role-permission relationships
    const rolesWithPermissions: RoleHasPermission[] = permissions.map(p => ({
      roleId: role.id,
      permissionId: p.id,
    }));

    // Early return if there are no permissions to process
    if (rolesWithPermissions.length === 0) return;

    // Conditional operation: create or delete based on value
    value
      ?
      await this.prisma.roleHasPermission.createMany({
        data: rolesWithPermissions,
        skipDuplicates: true,
      })
      :
      await this.prisma.roleHasPermission.deleteMany({
        where: {
          OR: rolesWithPermissions.map(({roleId, permissionId}) => ({
            roleId,
            permissionId,
          })),
        },
      });
  }


  /**
   * Finds a permission by its unique ID.
   * @param {string} permissionId - The ID of the permission to find.
   * @returns {Promise<Permission>} - A promise that resolves to the found permission or throws an exception if not found.
   * @throws {HttpException} - Throws an exception if the permission does not exist.
   */
  public async findById(permissionId: string): Promise<Permission> {
    const findPermission: Permission = await this.prisma.permission.findUnique({
      where: {id: permissionId},
    });
    if (!findPermission) throw new HttpException(409, "Permission doesn't exist");

    return findPermission;
  }

  /**
   * Creates a new permission with the provided data.
   * @param {Permission} data - The permission data to create.
   * @returns {Promise<Permission>} - A promise that resolves to the created permission.
   * @throws {HttpException} - Throws an exception if the permission name already exists.
   */
  public async create(data: Permission): Promise<Permission> {
    // Check if the permission already exists by name
    const findPermission: Permission = await this.prisma.permission.findUnique({
      where: {name: data.name},
    });
    if (findPermission) throw new HttpException(409, `This permission ${data.name} already exists`);

    // Create the new permission
    delete data.id;
    return this.prisma.permission.create({data});
  }

  /**
   * Updates an existing permission by its ID with the provided data.
   * Validates that the permission name is unique across permissions.
   * @param {string} permissionId - The ID of the permission to update.
   * @param {Permission} data - The new data for the permission.
   * @returns {Promise<Permission>} - A promise that resolves to the updated permission.
   * @throws {HttpException} - Throws an exception if the permission name already exists for a different permission.
   * @throws {HttpException} - Throws an exception if the permission with the provided ID is not found.
   */
  public async update(permissionId: string, data: Permission): Promise<Permission> {
    // Find the permission by ID to ensure the permission exists
    const findPermission: Permission | null = await this.prisma.permission.findUnique({
      where: {id: permissionId},
    });

    // Throw an error if unable to find permission with permissionId
    if (!findPermission) {
      throw new HttpException(404, `Permission with ID ${permissionId} not found`);
    }

    // Check if another permission exists with the same name but a different ID
    if (data.name && data.name.toLowerCase() !== findPermission.name.toLowerCase()) {
      const existingPermissionWithName: Permission | null = await this.prisma.permission.findUnique({
        where: {name: data.name},
      });

      // Throw an error if an existing permission with the same name is found
      if (existingPermissionWithName) {
        throw new HttpException(409, `Permission name ${data.name} is already in use by another permission`);
      }
    }

    // Update the permission with new data
    return this.prisma.permission.update({
      where: {id: permissionId},
      data: data,
    });
  }

  /**
   * Deletes permissions by their IDs.
   * @param {string[]} permissionIds - An array of permission IDs to delete.
   * @returns {Promise<boolean>} - A promise that resolves to true if permissions were successfully deleted.
   * @throws {HttpException} - Throws an exception if no permissions were deleted.
   */
  public async delete(permissionIds: string[]): Promise<boolean> {
    // Attempt to delete permissions with the provided IDs
    const result = await this.prisma.permission.deleteMany({
      where: {
        id: {in: permissionIds},
      },
    });

    // Throw an error if no permissions were deleted
    if (!result.count) throw new HttpException(409, "Permission doesn't exist");

    return true;
  }
}
