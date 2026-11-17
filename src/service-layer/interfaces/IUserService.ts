import { User } from '../models/User';

export interface IUserService {
  authenticate(phone: string, pass: string): Promise<User | null>;
  getUserWithDetails(phone: string): Promise<User[]>;
  getUserByPhone(phone: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  registerUser(request: any): Promise<User>;
  updateUser(request: any): Promise<boolean>;
  deleteUser(refId: string): Promise<boolean>;
  toggleBlockUser(refId: string): Promise<boolean | null>;
}
