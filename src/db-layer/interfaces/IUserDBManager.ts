import { User } from '../../service-layer/models/User'

export interface IUserDBManager {
  createUser(user: User): Promise<User>
  getUserByPhoneNumber(phoneNumber: string): Promise<User>
  getUsersListByPhoneNumber(phoneNumber: string): Promise<User[]>
  getUserById(id: string): Promise<User>
  getActiveUsers(): Promise<User[]>
  updateUserStatus(refId: string, status: string): Promise<boolean>
  updateBlock(id: string, isBlocked: boolean): Promise<boolean>
  updateUserAndDetails(refId: string, userDetailsFields: any, filter: Record<string, any>, userFields: any): Promise<void>
}
