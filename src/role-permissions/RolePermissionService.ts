import { PrismaClient, UserType } from '@prisma/client';
import NodeCache from 'node-cache';
import { Service } from 'typedi';

const prisma = new PrismaClient();

// Cache with a TTL of 60 seconds (for example)
const rolePermissionCache = new NodeCache({ stdTTL: 60 });
/**
 * Service class for handling user-related operations.
 * Extends the base service for CRUD functionality specific to the User model.
 */
@Service()
class RolePermissionService {
  /**
   * Synchronize roles for a given modelId with the provided array of roles.
   * @param modelId The ID of the model to synchronize roles for.
   * @param roles Array of role names to synchronize.
   * @param modelType The type of the model (UserType).
   */
  async syncRoles(modelId: string, roleIds: string[], modelType: UserType) {
    // Fetch the existing role associations for the given modelId and modelType
    const existingRoles = await prisma.modelHasRole.findMany({
      where: {
        modelId,
        modelType,
      },
    });

    // Extract the role IDs from the existing associations
    const existingRoleIds = existingRoles.map(r => r.roleId);

    // Roles to be added (present in 'roleIds' but not in 'existingRoleIds')
    const rolesToAdd = roleIds.filter(roleId => !existingRoleIds.includes(roleId));

    // Roles to be removed (present in 'existingRoleIds' but not in 'roleIds')
    const rolesToRemove = existingRoleIds.filter(roleId => !roleIds.includes(roleId));

    // Remove roles that should no longer be associated with the modelId
    if (rolesToRemove.length > 0) {
      await prisma.modelHasRole.deleteMany({
        where: {
          modelId: modelId,
          modelType: modelType,
          roleId: { in: rolesToRemove },
        },
      });
    }

    // Add roles that are missing
    if (rolesToAdd.length > 0) {
      const roleAssociations = rolesToAdd.map(roleId => ({
        modelId: modelId,
        roleId: roleId,
        modelType: modelType,
      }));

      await prisma.modelHasRole.createMany({
        data: roleAssociations,
      });
    }

    // Invalidate cache after synchronization
    this.invalidateCache(modelId, modelType);
  }

  /**
   * Assign a role to a user or admin.
   */
  async assignRole(modelId: string, roleId: string, modelType: UserType) {
    const role = await prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new Error(`Role ${role.name} does not exist`);
    }

    await prisma.modelHasRole.create({
      data: {
        roleId: role.id,
        modelId,
        modelType,
      },
    });

    this.invalidateCache(modelId, modelType); // Invalidate cache after assignment
  }

  /**
   * Assign a permission to a role.
   */
  async assignPermissionToRole(roleId: string, permissionId: string) {
    await prisma.roleHasPermission.create({
      data: {
        roleId,
        permissionId,
      },
    });
  }

  /**
   * Assign a permission directly to a user or admin.
   */
  async assignPermissionToUser(modelId: string, permissionId: string, modelType: UserType) {
    // Create a user-specific role if it doesn't exist
    const userSpecificRole = await prisma.role.findFirst({
      where: {
        name: `${modelType}_specific_${modelId}`,
        type: modelType,
      },
    });

    let roleId: string;

    if (!userSpecificRole) {
      const newRole = await prisma.role.create({
        data: {
          name: `${modelType}_specific_${modelId}`,
          type: modelType,
        },
      });
      roleId = newRole.id;
      await this.assignRole(modelId, newRole.id, modelType); // Assign the new role to the user/admin
    } else {
      roleId = userSpecificRole.id;
    }

    // Now assign the permission to this specific role
    await this.assignPermissionToRole(roleId, permissionId);
    this.invalidateCache(modelId, modelType); // Invalidate cache
  }

  /**
   * Check if a user/admin has a specific role.
   */
  async hasRole(modelId: string, roleName: string, modelType: UserType): Promise<boolean> {
    const cacheKey = `${modelType}_roles_${modelId}`;
    const cachedRoles = rolePermissionCache.get<string[]>(cacheKey);

    if (cachedRoles) {
      return cachedRoles.includes(roleName);
    }

    // Query the roles from the database if not cached
    const roles = await prisma.modelHasRole.findMany({
      where: {
        modelId,
        modelType,
      },
      include: {
        role: true,
      },
    });

    const roleNames = roles.map(r => r.role.name);
    rolePermissionCache.set(cacheKey, roleNames); // Cache the roles
    return roleNames.includes(roleName);
  }

  /**
   * Check if a user/admin has a specific permission.
   */
  async hasPermission(modelId: string, permissionName: string, modelType: UserType): Promise<boolean> {
    const cacheKey = `${modelType}_permissions_${modelId}`;
    const cachedPermissions = rolePermissionCache.get<string[]>(cacheKey);

    if (cachedPermissions) {
      return cachedPermissions.includes(permissionName);
    }

    // Query the permissions from the database if not cached
    const roles = await prisma.modelHasRole.findMany({
      where: {
        modelId,
        modelType,
      },
      include: {
        role: {
          include: {
            roleHasPermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    const permissions = roles.flatMap(role => role.role.roleHasPermissions.map(rp => rp.permission.name));
    rolePermissionCache.set(cacheKey, permissions); // Cache the permissions
    return permissions.includes(permissionName);
  }

  /**
   * Invalidate cache when roles/permissions are updated.
   */
  invalidateCache(modelId: string, modelType: UserType) {
    rolePermissionCache.del(`${modelType}_roles_${modelId}`);
    rolePermissionCache.del(`${modelType}_permissions_${modelId}`);
  }
}

export default RolePermissionService;
