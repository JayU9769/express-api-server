import {hash} from 'bcrypt';
import {Service} from 'typedi';
import {HttpException} from '@/exceptions/HttpException';
import {User} from '@prisma/client';
import {BaseService} from "@/services/base/base.service";

@Service()
export class UserService extends BaseService<User> {
  constructor() {
    super('User');
  }

  public async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  public async findById(userId: number): Promise<User> {
    const findUser: User = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async create(data: User): Promise<User> {
    const findUser: User = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (findUser) throw new HttpException(409, `This email ${data.email} already exists`);

    const hashedPassword = await hash(data.password, 10);
    return this.prisma.user.create({
      data: {...data, password: hashedPassword},
    });
  }

  public async update(userId: number, data: User): Promise<User> {
    const findUserByEmail: User = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (findUserByEmail && findUserByEmail.id !== userId) {
      throw new HttpException(409, `This email ${data.email} already exists`);
    }

    if (data.password) {
      const hashedPassword = await hash(data.password, 10);
      data = { ...data, password: hashedPassword };
    }

    return this.prisma.user.update({
      where: {id: userId},
      data: data,
    });
  }

  public async delete(userIds: number[]): Promise<boolean> {
    const result = await this.prisma.user.deleteMany({
      where: {
        id: { in: userIds },
      },
    });
    if (!result.count) throw new HttpException(409, "User doesn't exist");

    return true;
  }
}
