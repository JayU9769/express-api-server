import { Permission, Role } from '@prisma/client';

export interface IUpdatePermission {
  value: number;
  role: Role;
  permission: Permission;
}
