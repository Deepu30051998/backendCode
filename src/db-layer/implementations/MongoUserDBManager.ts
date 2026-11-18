import { IUserDBManager } from '../interfaces/IUserDBManager'
import { DBUserSchema, DBUserDetailsSchema } from '../models/DBUserSchema'
import { User } from '../../service-layer/models/User'
import mongoose from 'mongoose'
import { DBConstants } from '../models/DBConstant'
import { Utility } from '../../common/utils/Utility'
import { ObjectStatus } from '../../service-layer/models/ObjectStatus'

export class MongoUserDBManager implements IUserDBManager {
  private DBUserDetails: any
  private DBUsers: any

  constructor() {
    this.DBUserDetails = mongoose.model(DBConstants.UserDetailsCollection, DBUserDetailsSchema)
    this.DBUsers = mongoose.model(DBConstants.UsersCollection, DBUserSchema)
  }

  public async createUser(user: User): Promise<User> {
    const userDetails = await this.DBUserDetails.create({
      email: user.getEmail(),
      dob: user.getDob(),
      address: user.getAddress()
    })
    const userDoc = await this.DBUsers.create({
      phoneNumber: user.getPhoneNumber(),
      password: user.getPassword(),
      status: ObjectStatus.Active,
      ref_id: userDetails._id,
    })
    return Utility.getUser(userDoc, userDetails)
  }

  public async getUserByPhoneNumber(phoneNumber: string): Promise<User> {
    let ret = await this.DBUsers.findOne({ phoneNumber: phoneNumber })
    return ret ? Utility.getUser(ret) : null
  }

  public async getUsersListByPhoneNumber(phoneNumber: string): Promise<User[]> {
    const users = await this.DBUsers.aggregate([
      { $match: { phoneNumber: phoneNumber } },
      {
        $lookup: {
          from: DBConstants.UserDetailsCollection,
          localField: 'ref_id',
          foreignField: '_id',
          as: 'userdetails',
        }
      }])
    return Utility.getListOfItems(users, Utility.getUser)
  }

  public async getUserById(id: string): Promise<User> {
    let ret = await this.DBUserDetails.findOne({ _id: new mongoose.Types.ObjectId(id) })
    return Utility.getUser(ret)
  }

  public async getActiveUsers(): Promise<User[]> {
    const users = await this.DBUsers.aggregate([
      { $match: { status: ObjectStatus.Active } },
      {
        $lookup: {
          from: DBConstants.UserDetailsCollection,
          localField: 'ref_id',
          foreignField: '_id',
          as: 'userdetails',
        },
      },
    ])
    return Utility.getListOfItems(users, Utility.getUser)
  }

  public async updateUserStatus(refId: string, status: string): Promise<boolean> {
    let ret = await this.DBUsers.updateOne({ ref_id: new mongoose.Types.ObjectId(refId) }, { status })
    return ret.matchedCount > 0;
  }

  public async updateBlock(id: string, isBlocked: boolean): Promise<boolean> {
    let ret = await this.DBUserDetails.updateOne({ _id: new mongoose.Types.ObjectId(id) }, { block: isBlocked })
    return ret.matchedCount > 0;
  }

  public async updateUserAndDetails(refId: string, userDetailsFields: Record<string, any>, filter: Record<string, any>, userFields: Record<string, any>): Promise<void> {
    if (Object.keys(userDetailsFields).length > 0) {
      await this.DBUserDetails.updateOne({ _id: new mongoose.Types.ObjectId(refId) }, { $set: userDetailsFields })
    }
    if (Object.keys(userFields).length > 0) {
      await this.DBUsers.updateOne(filter, { $set: userFields })
    }
  }
}
