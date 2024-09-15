import { Admin, Permission, PrismaClient, Role, ModelHasRole } from "@prisma/client";

class Setup {
  private prisma = new PrismaClient();
  private defaultPassword = '12345678';
  private timestamp = new Date();

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

  private rolesForAdmin = ['admin'];

  public defaultPermissions: Permission[] = [];

  public defaultAdmins: Omit<Admin, "id">[] = [
    {
      email: "admin@gmail.com",
      name: "Admin",
      password: this.defaultPassword,
      status: 1,
      isSystem: 1,
      createdAt: this.timestamp,
      updatedAt: this.timestamp,
    },
  ];

  async init() {
    await Promise.all([
      this.insertRoles(),
      this.insertAdmins(),
      this.insertPermissions(),
    ]);
    await this.assignRoleToAdmin();
  }

  private async insertRoles() {
    await this.prisma.role.createMany({
      data: this.defaultRoles,
      skipDuplicates: true, // Avoid creating duplicates
    });
  }

  private async insertPermissions() {
    if (this.defaultPermissions.length > 0) {
      await this.prisma.permission.createMany({
        data: this.defaultPermissions,
        skipDuplicates: true,
      });
    }
  }

  private async insertAdmins() {
    await this.prisma.admin.createMany({
      data: this.defaultAdmins,
      skipDuplicates: true,
    });
  }

  private async assignRoleToAdmin() {
    const [admins, roles] = await Promise.all([
      this.prisma.admin.findMany({
        where: {
          email: { in: this.defaultAdmins.map(user => user.email) },
        },
        select: { id: true },
      }),
      this.prisma.role.findMany({
        where: {
          name: { in: this.rolesForAdmin },
        },
        select: { id: true },
      }),
    ]);

    if (admins.length && roles.length) {
      const modelHasRole: Omit<ModelHasRole, "id">[] = admins.flatMap(admin =>
        roles.map(role => ({
          roleId: role.id,
          modelType: 'admin',
          modelId: admin.id,
          createdAt: this.timestamp,
          updatedAt: this.timestamp,
        }))
      );

      await this.prisma.modelHasRole.createMany({
        data: modelHasRole,
      });
    }
  }
}

new Setup().init();
