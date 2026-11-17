import { IUserService } from '../interfaces/IUserService';
import { DataAccessLayerFactory } from '../../db-layer/DataAccessLayerFactory';
import { IUserDBManager } from '../../db-layer/interfaces/IUserDBManager';
import { User, Address } from '../models/User';
import { ObjectStatus } from 'service-layer/models/ObjectStatus';

export class UserService implements IUserService {
  private getUserDBManager(): IUserDBManager {
    return DataAccessLayerFactory.getUserDBManager();
  }

  public async authenticate(phone: string, pass: string): Promise<User | null> {
    const user = await this.getUserDBManager().getUserByPhoneNumber(phone);
    if (user && user.getPassword() === pass && user.getStatus()) {
      return user;
    }
    return null;
  }

  public async getUserWithDetails(phone: string): Promise<User[]> {
    return await this.getUserDBManager().getUsersListByPhoneNumber(phone);
  }

  public async getUserByPhone(phone: string): Promise<User | null> {
    return await this.getUserDBManager().getUserByPhoneNumber(phone);
  }

  public async getAllUsers(): Promise<User[]> {
    return await this.getUserDBManager().getActiveUsers();
  }

  public async registerUser(request: any): Promise<User> {
    const user = new User();
    user.setPhoneNumber(request.phoneNumber || request.phone || request.pnumber);
    user.setPassword(request.password || request.pass);
    user.setEmail(request.email);
    user.setDob(request.dob || request.DOB);

    if (request.address) {
      const address = new Address();
      address.setCity(request.address.city);
      address.setDistrict(request.address.district);
      address.setState(request.address.state);
      address.setCountry(request.address.country);
      user.setAddress(address);
    } else if (request.city || request.district || request.state || request.country) {
      const address = new Address();
      address.setCity(request.city);
      address.setDistrict(request.district);
      address.setState(request.state);
      address.setCountry(request.country);
      user.setAddress(address);
    }

    return await this.getUserDBManager().createUser(user);
  }

  public async updateUser(request: any): Promise<boolean> {
    const phone = request.phoneNumber || request.phone || request.pnumber;
    const existing = await this.getUserWithDetails(phone);
    const user = existing && existing[0];
    if (!user) return false;

    const refId = user.getRefId();
    if (!refId) return false;

    const updateDetails: Record<string, any> = {};
    const updateUser: Record<string, any> = {};

    if (request.email) updateDetails.email = request.email;
    if (request.dob || request.DOB) updateDetails.dob = request.dob || request.DOB;
    if (request.city) updateDetails['address.city'] = request.city;
    if (request.district) updateDetails['address.district'] = request.district;
    if (request.state) updateDetails['address.state'] = request.state;
    if (request.country) updateDetails['address.country'] = request.country;

    if (request.password || request.pass) {
      updateUser.password = request.password || request.pass;
    }
    if (request.pnnumber || request.newPhone) {
      updateUser.phoneNumber = request.pnnumber || request.newPhone;
    }

    await this.getUserDBManager().updateUserAndDetails(
      refId,
      updateDetails,
      { phoneNumber: phone },
      updateUser
    );
    return true;
  }

  public async deleteUser(refId: string): Promise<boolean> {
    return await this.getUserDBManager().updateUserStatus(refId, ObjectStatus.Inactive);
  }

  public async toggleBlockUser(refId: string): Promise<boolean | null> {
    const user = await this.getUserDBManager().getUserById(refId);
    if (!user) return null;
    const newBlockState = !user.getBlock();
    const updated = await this.getUserDBManager().updateBlock(refId, newBlockState);
    return updated ? newBlockState : null;
  }
}
