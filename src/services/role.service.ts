import {hash} from 'bcrypt';
import {Service} from 'typedi';
import {HttpException} from '@/exceptions/HttpException';
import {Role} from '@prisma/client';
import {BaseService} from "@/services/base/base.service";

@Service()
export class RoleService extends BaseService<Role> {
  constructor() {
    super('Role');
  }

  public async findAll(): Promise<Role[]> {
    return this.prisma.role.findMany();
  }

  public async findById(roleId: number): Promise<Role> {
    const findRole: Role = await this.prisma.role.findUnique({
      where: {id: roleId},
    });
    if (!findRole) throw new HttpException(409, "Role doesn't exist");

    return findRole;
  }

  public async create(data: Role): Promise<Role> {
    const findRole: Role = await this.prisma.role.findUnique({
      where: {name: data.name},
    });
    if (findRole) throw new HttpException(409, `This role ${data.name} already exists`);

    return this.prisma.role.create({data});
  }

  public async update(roleId: number, data: Role): Promise<Role> {
    const findRoleByName: Role = await this.prisma.role.findUnique({
      where: {name: data.name},
    });

    if (findRoleByName && findRoleByName.id !== roleId) {
      throw new HttpException(409, `This role ${data.name} already exists`);
    }

    return this.prisma.role.update({
      where: {id: roleId},
      data: data,
    });
  }

  public async delete(roleIds: number[]): Promise<boolean> {
    const result = await this.prisma.role.deleteMany({
      where: {
        id: {in: roleIds},
      },
    });
    if (!result.count) throw new HttpException(409, "Role doesn't exist");

    return true;
  }
}
