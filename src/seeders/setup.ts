import { Admin, Permission, PrismaClient, Role, ModelHasRole } from "@prisma/client";
import * as console from "node:console";
import {hash} from "bcrypt";
import bcrypt from "bcryptjs";

/**
 * Setup class for initializing default roles, permissions, and admins
 * in the Prisma database.
 */
class Setup {
  // Initialize Prisma Client
  private prisma = new PrismaClient();
  // Default password for created admin accounts
  private defaultPassword = '12345678';
  // Current timestamp for created and updated dates
  private timestamp = new Date();

  /**
   * Default roles to be created in the database.
   * Omits the 'id' field as it will be auto-generated.
   */
  public defaultRoles: Omit<Role, "id">[] = [
    {
      name: 'admin',
      type: 'admin',
      status: 1,
      isSystem: 1,
      createdAt: this.timestamp,
      updatedAt: this.timestamp,
    },
  ];

  // List of roles to assign to the default admin
  private rolesForAdmin = ['admin'];

  /**
   * Default permissions to be created in the database.
   * Each permission is linked to a parent permission if applicable.
   * Uses dynamic generation for CRUD actions.
   */
  public defaultPermissions: Omit<Permission, "id">[] = [
    {
      name: 'role',
      type: 'admin',
      parentId: null,
      createdAt: this.timestamp,
      updatedAt: this.timestamp,
    },
    {
      name: 'admin',
      type: 'admin',
      parentId: null,
      createdAt: this.timestamp,
      updatedAt: this.timestamp,
    },
    {
      name: 'user',
      type: 'admin',
      parentId: null,
      createdAt: this.timestamp,
      updatedAt: this.timestamp,
    },
    {
      name: 'permission',
      type: 'admin',
      parentId: null,
      createdAt: this.timestamp,
      updatedAt: this.timestamp,
    },
    // Dynamically generate CRUD permissions for role, admin, and user
    ...['create', 'view', 'update', 'delete'].flatMap(action => (
      ['role', 'admin', 'user'].map(parent => ({
        name: `${parent}-${action}`,
        type: 'admin',
        parentId: parent,
        createdAt: this.timestamp,
        updatedAt: this.timestamp,
      })) as Omit<Permission, "id">[]
    )),
  ];

  /**
   * Default admin users to be created in the database.
   * Omits the 'id' field as it will be auto-generated.
   */
  public defaultAdmins: Omit<Admin, "id">[] = [
    {
      email: "admin@admin.com",
      name: "Admin",
      password: bcrypt.hashSync(this.defaultPassword),
      status: 1,
      isSystem: 1,
      createdAt: this.timestamp,
      updatedAt: this.timestamp,
    },
  ];

  /**
   * Initialize the setup process by inserting roles, permissions,
   * and admins, and assigning roles to admins.
   */
  async init() {
    console.info("Setup Started...")
    await Promise.all([
      this.insertRoles(),
      this.insertAdmins(),
      this.insertPermissions(),
    ]);
    await this.assignRoleToAdmin();
    console.info("Setup Complete....")
  }

  /**
   * Inserts default roles into the database.
   * Skips duplicate entries based on the role name.
   */
  private async insertRoles() {
    console.info("Inserting Roles...")
    await this.prisma.role.createMany({
      data: this.defaultRoles,
      skipDuplicates: true,
    });
  }

  /**
   * Inserts default permissions into the database.
   * First inserts parent permissions, then child permissions linked by parent ID.
   */
  private async insertPermissions() {
    console.info("Inserting Permissions...")
    const parentPermissions = this.defaultPermissions.filter(p => !p.parentId);
    const childPermissions = this.defaultPermissions.filter(p => p.parentId);

    // Insert parent permissions (those without parentId)
    await this.prisma.permission.createMany({
      data: parentPermissions,
      skipDuplicates: true,
    });

    // Fetch parent permissions to map child permissions by parentId
    const parentRecords = await this.prisma.permission.findMany({
      where: {
        name: { in: parentPermissions.map(p => p.name) },
      },
      select: { id: true, name: true },
    });

    // Create a map of parent permission names to their IDs
    const parentMap = new Map(parentRecords.map(p => [p.name, p.id]));

    // Insert child permissions and link them to the correct parent ID
    await this.prisma.permission.createMany({
      data: childPermissions.map(p => ({
        ...p,
        parentId: parentMap.get(p.parentId),
      })),
      skipDuplicates: true,
    });
  }

  /**
   * Inserts default admins into the database.
   * Skips duplicate entries based on email.
   */
  private async insertAdmins() {
    await this.prisma.admin.createMany({
      data: this.defaultAdmins,
      skipDuplicates: true,
    });
  }

  /**
   * Assigns the admin role to default admins in the database.
   * Links admin users to the 'admin' role in the `ModelHasRole` table.
   */
  private async assignRoleToAdmin() {
    console.info("Inserting Admins...")
    const [admins, roles] = await Promise.all([
      // Fetch admin records based on default admin emails
      this.prisma.admin.findMany({
        where: {
          email: { in: this.defaultAdmins.map(admin => admin.email) },
        },
        select: { id: true },
      }),
      // Fetch role records based on admin roles
      this.prisma.role.findMany({
        where: {
          name: { in: this.rolesForAdmin },
        },
        select: { id: true },
      }),
    ]);

    console.info("Assigning roles...")
    if (admins.length && roles.length) {
      // Create entries for assigning roles to each admin
      const modelHasRole: Omit<ModelHasRole, "id">[] = admins.flatMap(admin =>
        roles.map(role => ({
          roleId: role.id,
          modelType: 'admin',
          modelId: admin.id,
          createdAt: this.timestamp,
          updatedAt: this.timestamp,
        }))
      );

      // Insert role assignments into the `ModelHasRole` table
      await this.prisma.modelHasRole.createMany({
        data: modelHasRole,
        skipDuplicates: true,
      });
    }
  }
}

// Initialize the setup process
new Setup().init();
