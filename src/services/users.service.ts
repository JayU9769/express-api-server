import { hash } from 'bcrypt';
import { FindAndCountOptions } from 'sequelize';
import { Service } from 'typedi';
import { User } from '@/interfaces/users.interface';
import { HttpException } from '@/exceptions/HttpException';
import { User as UserModel } from '@/models/users.model';
import { DataTable } from '@/interfaces/datatable.interface';
import { BaseService } from './base/base.service';

@Service()
export class UserService extends BaseService<UserModel> {
  constructor() {
    super(UserModel);
  }
  public async findUserById(userId: string): Promise<User> {
    const findUser: User = await UserModel.findByPk(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async createUser(userData: User): Promise<User> {
    const findUser: User = await UserModel.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await UserModel.create({ ...userData, password: hashedPassword });

    return createUserData;
  }

  public async updateUser(userId: Number, userData: User): Promise<User> {
    if (userData.email) {
      const findUser: User = await UserModel.findOne({ where: { email: userData.email } });
      if (findUser && findUser.id != userId) throw new HttpException(409, `This email ${userData.email} already exists`);
    }

    if (userData.password) {
      const hashedPassword = await hash(userData.password, 10);
      userData = { ...userData, password: hashedPassword };
    }

    await UserModel.update({ ...userData }, { where: { id: userId } });

    const updateUserById: User = await UserModel.findOne({ where: { email: userData.email } });
    if (!updateUserById) throw new HttpException(409, "User doesn't exist");

    return updateUserById;
  }

  public async deleteUser(userId: string): Promise<boolean> {
    const deleteUserById = await UserModel.destroy({ where: { id: userId } });
    if (!deleteUserById) throw new HttpException(409, "User doesn't exist");

    return true;
  }
}
