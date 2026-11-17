import mongoose from "mongoose"
import { Address, User } from '../../service-layer/models/User'
import { ServiceObject } from "service-layer/models/ServiceObject";
import { ObjectStatus } from "service-layer/models/ObjectStatus";

export class Utility {

  public static getUser(userDoc: any, detailsDoc: any = null): User {
    if (!userDoc) return null as any;
    const details = detailsDoc || (userDoc.userdetails && userDoc.userdetails[0]) || {}
    let model = new User()
    model.setPhoneNumber(userDoc.phoneNumber || userDoc.phone_no)
    model.setPassword(userDoc.password || userDoc.pass)
    model.setStatus(userDoc.status)
    model.setRefId(userDoc.ref_id)
    model.setEmail(details.email)
    model.setDob(details.dob || details.DOB)
    model.setBlock(details.block)
    if (details.address) {
      model.setAddress(Utility.getAddress(details.address))
    }
    Utility.setServiceObjectProperties(model, details)
    return model
  }

  public static setServiceObjectProperties(object: ServiceObject, item: any): void {
    const id = item._id != null ? item._id : item.id;
    if (id) {
      object.setId(Utility.getStringId(id));
    }
    object.setEnable(item.enable);
    object.setCreatedAt(item.createdAt);
    object.setLastModifiedAt(item.updatedAt ? item.updatedAt : item.lastModifiedAt);
    object.setStatus(Utility.parseDefaultEnum(item.status, ObjectStatus, ObjectStatus.Active));
  }

  public static parseDefaultEnum<T>(value: string, enumType: T, defaultEnumValue: T[keyof T]): T[keyof T] {
    const found: T[keyof T] = Utility.parseEnum(value, enumType);
    if (found == undefined) {
      return defaultEnumValue;
    }
    return found;
  }

  public static parseEnum<T>(value: string, enumType: T): T[keyof T] | undefined {
    if (!value) {
      return undefined;
    }

    for (const property in enumType) {
      const enumMember = enumType[property];
      if (typeof enumMember === 'string') {
        if (enumMember.toLowerCase().trim() === value.toLowerCase().trim()) {
          const key = property as string as keyof typeof enumType;
          return enumType[key];
        }
      }
    }
    return undefined;
  }

  public static getAddress(data: any): Address {
    let model = new Address()
    if (!data) return model
    model.setCity(data.city)
    model.setDistrict(data.district)
    model.setState(data.state)
    model.setCountry(data.country)
    return model
  }

  public static getListOfItems<T>(itemsArray: any, getItem: (item: any) => T): Array<T> {
    if (itemsArray == undefined || itemsArray == null) {
      return []
    }
    let items: Array<T> = itemsArray.map(it => {
      return getItem(it)
    })
    return items
  }

  public static isValidMongoId(id: any): boolean {
    try {
      return Utility.getStringId(id) != null ? true : false
    } catch (error) {
      return false
    }
  }

  public static getStringId(id: any): string {
    return id != null ? new mongoose.Types.ObjectId(id).toHexString() : null
  }

}
