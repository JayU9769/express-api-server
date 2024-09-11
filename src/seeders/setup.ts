import {Admin, Permission, PrismaClient, Role} from "@prisma/client";

class Setup {
  private prisma = new PrismaClient();

  public defaultRoles: Role[] = [
    {
      id: '',
      name: 'admin',
      type: 'admin',
      status: 1,
      isSystem: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  public defaultPermissions: Permission[] = []

  public defaultAdmins: Admin[] = [

  ]

  async init() {
    await this.insertRoles()
  }

  async insertRoles() {
    await this.prisma.role.createMany({
      data: this.defaultRoles,
    });
  }

  async insertPermissions() {
    await this.prisma.permission.createMany({
      data: this.defaultPermissions,
    });
  }

  async insertAdmins() {
    await this.prisma.admin.createMany({
      data: this.defaultAdmins,
    });
  }

  async assignRoleToAdmin() {

  }

}

new Setup().init();