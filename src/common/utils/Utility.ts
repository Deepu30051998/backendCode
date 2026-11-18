import mongoose from "mongoose"
import { Address, User } from '../../service-layer/models/User'
import { ServiceObject } from "../../service-layer/models/ServiceObject"
import { ObjectStatus } from "../../service-layer/models/ObjectStatus"

export class Utility {
  public static getUser(userDoc: any): User {
    let model = new User()
    model.setPhoneNumber(userDoc.phoneNumber)
    model.setPassword(userDoc.password)
    model.setEmail(userDoc.email)
    model.setDob(userDoc.dob)
    model.setAddress(Utility.getAddress(userDoc.address))
    Utility.setServiceObjectProperties(model, userDoc)
    return model
  }

  public static setServiceObjectProperties(object: ServiceObject, item: any): void {
    const id = item._id != null ? item._id : item.id
    if (id) {
      object.setId(Utility.getStringId(id))
    }
    object.setEnable(item.enable !== undefined ? item.enable : true)
    object.setCreatedAt(item.createdAt)
    object.setLastModifiedAt(item.updatedAt ? item.updatedAt : item.lastModifiedAt)
    object.setStatus(Utility.parseDefaultEnum(item.status, ObjectStatus, ObjectStatus.Active))
  }

  public static parseDefaultEnum<T>(value: string, enumType: T, defaultEnumValue: T[keyof T]): T[keyof T] {
    const found: T[keyof T] = Utility.parseEnum(value, enumType)
    if (found == undefined) {
      return defaultEnumValue
    }
    return found
  }

  public static parseEnum<T>(value: string, enumType: T): T[keyof T] | undefined {
    if (!value) {
      return undefined
    }

    for (const property in enumType) {
      const enumMember = enumType[property]
      if (typeof enumMember === 'string') {
        if (enumMember.toLowerCase().trim() === value.toLowerCase().trim()) {
          const key = property as string as keyof typeof enumType
          return enumType[key]
        }
      }
    }
    return undefined
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
    } catch {
      return false
    }
  }

  public static getStringId(id: any): string {
    return id != null ? new mongoose.Types.ObjectId(id).toHexString() : null
  }
}
