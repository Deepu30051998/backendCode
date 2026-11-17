import { User } from '../../service-layer/models/User';

export interface IUserDBManager {
  save(userData: { phone: string; pass: string }, detailsData: any): Promise<User>;
  findByPhone(phone: string): Promise<User | null>;
  findWithDetailsByPhone(phone: string): Promise<User[]>;
  findDetailsById(id: string): Promise<any>;
  findAllActive(): Promise<User[]>;
  updateStatus(refId: string, status: boolean): Promise<any>;
  updateBlock(id: string, isBlocked: boolean): Promise<any>;
  updateUserAndDetails(
    refId: string,
    userDetailsFields: Record<string, any>,
    filter: Record<string, any>,
    userFields: Record<string, any>
  ): Promise<void>;
}
