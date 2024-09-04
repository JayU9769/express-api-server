import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { HttpException } from '@/exceptions/HttpException';
import { User } from '@prisma/client';
import { BaseService } from './base/base.service';

@Service()
export class UserService extends BaseService<User> {
  constructor() {
    super('User');
  }

  public async findUserById(userId: number): Promise<User> {
    const findUser: User = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async createUser(userData: User): Promise<User> {
    const findUser: User = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const newUser = await this.prisma.user.create({
      data: { name: userData.name, email: userData.email, status: userData.status, password: hashedPassword },
    });

    return newUser;
  }

  public async updateUser(userId: number, userData: User): Promise<User> {
    const findUserByEmail: User = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (findUserByEmail && findUserByEmail.id !== userId) {
      throw new HttpException(409, `This email ${userData.email} already exists`);
    }

    if (userData.password) {
      const hashedPassword = await hash(userData.password, 10);
      userData = { ...userData, password: hashedPassword };
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: userData,
    });

    return updatedUser;
  }

  public async deleteUser(userIds: number[]): Promise<boolean> {
    const deleteUser = await this.prisma.user.deleteMany({
      where: {
        id: { in: userIds },
      },
    });
    if (!deleteUser.count) throw new HttpException(409, "User doesn't exist");

    return true;
  }
}
