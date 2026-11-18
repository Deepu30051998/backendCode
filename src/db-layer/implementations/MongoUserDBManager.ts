import { IUserDBManager } from '../interfaces/IUserDBManager'
import { DBUserSchema } from '../models/DBUserSchema'
import { User } from '../../service-layer/models/User'
import mongoose from 'mongoose'
import { DBConstants } from '../models/DBConstant'
import { Utility } from '../../common/utils/Utility'
import { ObjectStatus } from '../../service-layer/models/ObjectStatus'

export class MongoUserDBManager implements IUserDBManager {
  private DBUsers: any

  constructor() {
    this.DBUsers = mongoose.model(DBConstants.UsersCollection, DBUserSchema)
  }

  public async createUser(user: User): Promise<User> {
    const userDoc = await this.DBUsers.create(user)
    return Utility.getUser(userDoc)
  }

  public async getUserByPhoneNumber(phoneNumber: string): Promise<User> {
    const ret = await this.DBUsers.findOne({ phoneNumber })
    return ret ? Utility.getUser(ret) : null
  }

  public async verifyUser(phoneNumber: string, password: string): Promise<User> {
    const ret = await this.DBUsers.findOne({ phoneNumber, password })
    return ret ? Utility.getUser(ret) : null
  }

  public async updateUserStatus(id: string, status: string): Promise<boolean> {
    const ret = await this.DBUsers.updateOne({ _id: new mongoose.Types.ObjectId(id) },
      { status }
    )
    return ret.matchedCount > 0
  }

  public async toggleUser(id: string, enable: boolean): Promise<boolean> {
    const ret = await this.DBUsers.updateOne({ _id: new mongoose.Types.ObjectId(id) },
      { $set: { enable: enable } }
    )
    return ret.matchedCount > 0
  }

  public async updateUser(user: User): Promise<boolean> {
    let updateQry = {}
    if (user.getDob()) {
      updateQry['dob'] = user.getDob()
    }
    if (user.getAddress()) {
      updateQry['address'] = user.getAddress()
    }
    if (user.getEmail()) {
      updateQry['email'] = user.getEmail()
    }
    if (user.getPassword()) {
      updateQry['password'] = user.getPassword()
    }
    if (user.getPhoneNumber()) {
      updateQry['phoneNumber'] = user.getPhoneNumber()
    }

    const ret = await this.DBUsers.updateOne(
      { _id: new mongoose.Types.ObjectId(user.getId()) },
      { $set: updateQry }
    )
    return ret.matchedCount > 0
  }

   public async getUsersByPhoneNumber(phoneNumber: string): Promise<User[]> {
    const users = await this.DBUsers.find({ phoneNumber })
    return Utility.getListOfItems(users, Utility.getUser)
  }

  public async getUserById(id: string): Promise<User> {
    const ret = await this.DBUsers.findOne({ _id: new mongoose.Types.ObjectId(id) })
    return ret ? Utility.getUser(ret) : null
  }

  public async getActiveUsers(): Promise<User[]> {
    const users = await this.DBUsers.find({ status: ObjectStatus.Active })
    return Utility.getListOfItems(users, Utility.getUser)
  }
}
