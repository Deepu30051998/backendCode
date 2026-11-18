import { User } from '../models/User';

export interface IUserService {
  verifyUser(phoneNumber: string, password: string): Promise<User>
  getUsersByPhoneNumber(phoneNumber: string): Promise<User[]>
  getUserByPhone(phoneNumber: string): Promise<User>
  getAllUsers(): Promise<User[]>
  createUser(user: User): Promise<User>
  updateUser(user: User): Promise<boolean>
  deleteUser(id: string): Promise<boolean>
  toggleUser(id: string, enable: boolean): Promise<boolean>
}
