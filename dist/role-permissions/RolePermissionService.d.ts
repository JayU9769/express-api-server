import { UserType } from '@prisma/client';
/**
 * Service class for handling user-related operations.
 * Extends the base service for CRUD functionality specific to the User model.
 */
declare class RolePermissionService {
    /**
     * Synchronize roles for a given modelId with the provided array of roles.
     * @param modelId The ID of the model to synchronize roles for.
     * @param roleIds
     * @param modelType The type of the model (UserType).
     */
    syncRoles(modelId: string, roleIds: string[], modelType: UserType): Promise<void>;
    /**
     * Assign a role to a user or admin.
     */
    assignRole(modelId: string, roleId: string, modelType: UserType): Promise<void>;
    /**
     * Assign a permission to a role.
     */
    assignPermissionToRole(roleId: string, permissionId: string): Promise<void>;
    /**
     * Assign a permission directly to a user or admin.
     */
    assignPermissionToUser(modelId: string, permissionId: string, modelType: UserType): Promise<void>;
    /**
     * Check if a user/admin has a specific role.
     */
    hasRole(modelId: string, roleName: string, modelType: UserType): Promise<boolean>;
    /**
     * Check if a user/admin has a specific permission.
     */
    hasPermission(modelId: string, permissionName: string, modelType: UserType): Promise<boolean>;
    getRoles(modelId: string, modelType: UserType): Promise<{
        id: string;
        name: string;
    }[]>;
    /**
     * Invalidate cache when roles/permissions are updated.
     */
    invalidateCache(modelId: string, modelType: UserType): void;
}
export default RolePermissionService;
