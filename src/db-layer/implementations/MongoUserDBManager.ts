import { IUserDBManager } from '../interfaces/IUserDBManager';
import { DBUserSchema, DBUserDetailsSchema } from '../models/DBUserSchema';
import { User } from '../../service-layer/models/User';
import mongoose from 'mongoose';
import { DBConstants } from '../models/DBConstant';

export class MongoUserDBManager implements IUserDBManager {

  private DBUserDetails: any;
  private DBUsers: any;

  constructor() {
    this.DBUserDetails = mongoose.model(DBConstants.UserDetailsCollection, DBUserDetailsSchema);
    this.DBUsers = mongoose.model(DBConstants.UsersCollection, DBUserSchema);
  }

  public async save(userData: { phone: string; pass: string }, detailsData: any): Promise<User> {
    const detailsDoc = await this.DBUserDetails.create({
      email: detailsData.email,
      DOB: detailsData.dob,
      address: {
        city: detailsData.city,
        district: detailsData.district,
        state: detailsData.state,
        country: detailsData.country,
      },
    });

    const userDoc = await this.DBUsers.create({
      phone_no: userData.phone,
      pass: userData.pass,
      status: true,
      ref_id: detailsDoc._id,
    });

    return this.toModel(userDoc.toObject(), detailsDoc.toObject());
  }

  public async findByPhone(phone: string): Promise<User | null> {
    const doc = await this.DBUsers.findOne({ phone_no: phone }).lean();
    return doc ? this.toModel(doc as any) : null;
  }

  public async findWithDetailsByPhone(phone: string): Promise<User[]> {
    const docs = await this.DBUsers.aggregate([
      { $match: { phone_no: phone } },
      {
        $lookup: {
          from: 'userdetails',
          localField: 'ref_id',
          foreignField: '_id',
          as: 'order',
        },
      },
    ]);
    return docs.map((d) => this.toModel(d));
  }

  public async findDetailsById(id: string): Promise<any> {
    return await this.DBUserDetails.findById(id).lean();
  }

  public async findAllActive(): Promise<User[]> {
    const docs = await this.DBUsers.aggregate([
      { $match: { status: true } },
      {
        $lookup: {
          from: 'userdetails',
          localField: 'ref_id',
          foreignField: '_id',
          as: 'order',
        },
      },
    ]);
    return docs.map((d) => this.toModel(d));
  }

  public async updateStatus(refId: string, status: boolean): Promise<any> {
    return await this.DBUsers.updateOne({ ref_id: refId }, { status });
  }

  public async updateBlock(id: string, isBlocked: boolean): Promise<any> {
    return await this.DBUserDetails.updateOne({ _id: id }, { block: isBlocked });
  }

  public async updateUserAndDetails(
    refId: string,
    userDetailsFields: Record<string, any>,
    filter: Record<string, any>,
    userFields: Record<string, any>
  ): Promise<void> {
    if (Object.keys(userDetailsFields).length > 0) {
      await this.DBUserDetails.updateOne({ _id: refId }, { $set: userDetailsFields });
    }
    if (Object.keys(userFields).length > 0) {
      await this.DBUsers.updateOne(filter, { $set: userFields });
    }
  }

  private toModel(userDoc: any, detailsDoc: any = null): User {
    const details = detailsDoc || (userDoc.order && userDoc.order[0]) || {};
    return new User({
      id: userDoc._id ? userDoc._id.toString() : null,
      phone: userDoc.phone_no,
      pass: userDoc.pass,
      status: userDoc.status,
      refId: userDoc.ref_id
        ? userDoc.ref_id.toString()
        : details._id
          ? details._id.toString()
          : null,
      email: details.email,
      dob: details.DOB,
      address: details.address || {},
      block: details.block !== undefined ? details.block : false,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
    });
  }
}
