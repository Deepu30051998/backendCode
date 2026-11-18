import { IUserService } from '../interfaces/IUserService'
import { DataAccessLayerFactory } from '../../db-layer/DataAccessLayerFactory'
import { IUserDBManager } from '../../db-layer/interfaces/IUserDBManager'
import { User } from '../models/User'
import { ObjectStatus } from '../models/ObjectStatus'

export class UserService implements IUserService {
  private DBUsers: IUserDBManager

  constructor() {
    this.DBUsers = DataAccessLayerFactory.getUserDBManager()
  }

  public async createUser(user: User): Promise<User> {
    return await this.DBUsers.createUser(user)
  }

  public async updateUser(user: User): Promise<boolean> {
    return await this.DBUsers.updateUser(user)
  }

  public async deleteUser(id: string): Promise<boolean> {
    return await this.DBUsers.updateUserStatus(id, ObjectStatus.Inactive)
  }

  public async toggleUser(id: string, enable: boolean): Promise<boolean> {
    return await this.DBUsers.toggleUser(id, enable)
  }

  public async verifyUser(phoneNumber: string, password: string): Promise<User> {
    return await this.DBUsers.verifyUser(phoneNumber, password)
  }

  public async getUsersByPhoneNumber(phoneNumber: string): Promise<User[]> {
    return await this.DBUsers.getUsersByPhoneNumber(phoneNumber);
  }

  public async getUserByPhone(phone: string): Promise<User | null> {
    return await this.DBUsers.getUserByPhoneNumber(phone);
  }

  public async getAllUsers(): Promise<User[]> {
    return await this.DBUsers.getActiveUsers();
  }
}
