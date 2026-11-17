import { User } from '../models/User'

export interface IUserService {
  authenticate(phoneNumber: string, password: string): Promise<User>
  getUserWithDetails(phoneNumber: string): Promise<User[]>
  getUserByPhone(phoneNumber: string): Promise<User>
  getAllUsers(): Promise<User[]>
  registerUser(request: any): Promise<User>
  updateUser(request: any): Promise<boolean>
  deleteUser(refId: string): Promise<boolean>
  toggleBlockUser(refId: string): Promise<boolean>
}
