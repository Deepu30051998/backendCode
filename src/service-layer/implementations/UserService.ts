import { IUserService } from '../interfaces/IUserService';
import { DataAccessLayerFactory } from '../../db-layer/DataAccessLayerFactory';
import { IUserDBManager } from '../../db-layer/interfaces/IUserDBManager';
import { User } from '../models/User';

export class UserService implements IUserService {
  private getUserDBManager(): IUserDBManager {
    return DataAccessLayerFactory.getUserDBManager();
  }

  public async authenticate(phone: string, pass: string): Promise<User | null> {
    const user = await this.getUserDBManager().findByPhone(phone);
    if (user && user.getPass() === pass && user.getStatus() === true) {
      return user;
    }
    return null;
  }

  public async getUserWithDetails(phone: string): Promise<User[]> {
    return await this.getUserDBManager().findWithDetailsByPhone(phone);
  }

  public async getUserByPhone(phone: string): Promise<User | null> {
    return await this.getUserDBManager().findByPhone(phone);
  }

  public async getAllUsers(): Promise<User[]> {
    return await this.getUserDBManager().findAllActive();
  }

  public async registerUser(request: any): Promise<User> {
    const userData = {
      phone: request.phone || request.pnumber,
      pass: request.pass,
    };
    const detailsData = {
      email: request.email,
      dob: request.dob,
      city: request.city,
      district: request.district,
      state: request.state,
      country: request.country,
    };
    return await this.getUserDBManager().save(userData, detailsData);
  }

  public async updateUser(request: any): Promise<boolean> {
    const phone = request.phone || request.pnumber;
    const existing = await this.getUserWithDetails(phone);
    const user = existing && existing[0];
    if (!user) return false;

    const refId = user.getRefId();
    if (!refId) return false;

    const updateDetails: Record<string, any> = {};
    const updateUser: Record<string, any> = {};

    if (request.email) updateDetails.email = request.email;
    if (request.dob) updateDetails.DOB = request.dob;
    if (request.city) updateDetails['address.city'] = request.city;
    if (request.district) updateDetails['address.district'] = request.district;
    if (request.state) updateDetails['address.state'] = request.state;
    if (request.country) updateDetails['address.country'] = request.country;

    if (request.pass) updateUser.pass = request.pass;
    if (request.pnnumber || request.newPhone) {
      updateUser.phone_no = request.pnnumber || request.newPhone;
    }

    await this.getUserDBManager().updateUserAndDetails(
      refId,
      updateDetails,
      { phone_no: phone },
      updateUser
    );
    return true;
  }

  public async deleteUser(refId: string): Promise<any> {
    return await this.getUserDBManager().updateStatus(refId, false);
  }

  public async toggleBlockUser(refId: string): Promise<boolean | null> {
    const details = await this.getUserDBManager().findDetailsById(refId);
    if (!details) return null;
    const newBlockState = !details.block;
    await this.getUserDBManager().updateBlock(refId, newBlockState);
    return newBlockState;
  }
}
