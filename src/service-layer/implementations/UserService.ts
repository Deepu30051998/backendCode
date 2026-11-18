import { IUserService } from '../interfaces/IUserService'
import { DataAccessLayerFactory } from '../../db-layer/DataAccessLayerFactory'
import { IUserDBManager } from '../../db-layer/interfaces/IUserDBManager'
import { User, Address } from '../models/User'
import { ObjectStatus } from '../../service-layer/models/ObjectStatus'

export class UserService implements IUserService {
  private DBUsers: IUserDBManager
  constructor() {
    this.DBUsers = DataAccessLayerFactory.getUserDBManager()
  }

  public async authenticate(phoneNumber: string, pass: string): Promise<User> {
    const user = await this.DBUsers.getUserByPhoneNumber(phoneNumber)
    if (user && user.getPassword() === pass && user.getStatus()) {
      return user
    }
    return null
  }

  public async getUserWithDetails(phoneNumber: string): Promise<User[]> {
    return await this.DBUsers.getUsersListByPhoneNumber(phoneNumber)
  }

  public async getUserByPhone(phoneNumber: string): Promise<User> {
    return await this.DBUsers.getUserByPhoneNumber(phoneNumber)
  }

  public async getAllUsers(): Promise<User[]> {
    return await this.DBUsers.getActiveUsers()
  }

  public async registerUser(request: any): Promise<User> {
    const user = new User()
    user.setPhoneNumber(request.phoneNumber || request.phone || request.pnumber)
    user.setPassword(request.password || request.pass)
    user.setEmail(request.email)
    user.setDob(request.dob || request.DOB)

    if (request.address) {
      const address = new Address()
      address.setCity(request.address.city)
      address.setDistrict(request.address.district)
      address.setState(request.address.state)
      address.setCountry(request.address.country)
      user.setAddress(address)
    } else if (request.city || request.district || request.state || request.country) {
      const address = new Address()
      address.setCity(request.city)
      address.setDistrict(request.district)
      address.setState(request.state)
      address.setCountry(request.country)
      user.setAddress(address)
    }

    return await this.DBUsers.createUser(user)
  }

  public async updateUser(request: any): Promise<boolean> {
    const phone = request.phoneNumber || request.phone || request.pnumber
    const existing = await this.getUserWithDetails(phone)
    const user = existing && existing[0]
    if (!user) return false

    const refId = user.getRefId()
    if (!refId) return false

    const updateDetails: Record<string, any> = {}
    const updateUser: Record<string, any> = {}

    if (request.email) updateDetails.email = request.email
    if (request.dob || request.DOB) updateDetails.dob = request.dob || request.DOB
    if (request.city) updateDetails['address.city'] = request.city
    if (request.district) updateDetails['address.district'] = request.district
    if (request.state) updateDetails['address.state'] = request.state
    if (request.country) updateDetails['address.country'] = request.country

    if (request.password || request.pass) {
      updateUser.password = request.password || request.pass
    }
    if (request.pnnumber || request.newPhone) {
      updateUser.phoneNumber = request.pnnumber || request.newPhone
    }

    await this.DBUsers.updateUserAndDetails(
      refId,
      updateDetails,
      { phoneNumber: phone },
      updateUser
    )
    return true
  }

  public async deleteUser(refId: string): Promise<boolean> {
    return await this.DBUsers.updateUserStatus(refId, ObjectStatus.Inactive)
  }

  public async toggleBlockUser(refId: string): Promise<boolean> {
    const user = await this.DBUsers.getUserById(refId)
    if (!user) return null
    const newBlockState = !user.getBlock()
    const updated = await this.DBUsers.updateBlock(refId, newBlockState)
    return updated ? newBlockState : null
  }
}
