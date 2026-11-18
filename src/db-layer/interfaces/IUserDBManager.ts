import { User } from '../../service-layer/models/User'

export interface IUserDBManager {
  createUser(user: User): Promise<User>
  verifyUser(phoneNumber: string, password: string): Promise<User>
  updateUserStatus(id: string, status: string): Promise<boolean>
  updateUser(user: User): Promise<boolean>
  toggleUser(id: string, enable: boolean): Promise<boolean>
  getUserByPhoneNumber(phoneNumber: string): Promise<User>
  getUsersByPhoneNumber(phoneNumber: string): Promise<User[]>
  getUserById(id: string): Promise<User>
  getActiveUsers(): Promise<User[]>
}
