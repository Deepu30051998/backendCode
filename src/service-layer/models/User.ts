import { ServiceObject } from "./ServiceObject"

export class Address {
  private city: string
  private district: string
  private state: string
  private country: string

  public getCity(): string {
    return this.city
  }

  public setCity(city: string): void {
    this.city = city
  }

  public getDistrict(): string {
    return this.district
  }

  public setDistrict(district: string): void {
    this.district = district
  }

  public getState(): string {
    return this.state
  }

  public setState(state: string): void {
    this.state = state
  }

  public getCountry(): string {
    return this.country
  }

  public setCountry(country: string): void {
    this.country = country
  }
}

export class User extends ServiceObject{
  private phoneNumber: string
  private password: string
  private refId: string
  private email: string
  private dob: string
  private address: Address
  private block: boolean

  public getPhoneNumber(): string {
    return this.phoneNumber
  }

  public setPhoneNumber(phoneNumber: string): void {
    this.phoneNumber = phoneNumber
  }

  public getPassword(): string {
    return this.password
  }

  public setPassword(password: string): void {
    this.password = password
  } 

  public getRefId(): string | null {
    return this.refId
  }

  public setRefId(refId: string | null): void {
    this.refId = refId
  }

  public getEmail(): string | undefined {
    return this.email
  }

  public setEmail(email: string): void {
    this.email = email
  }

  public getDob(): string | undefined {
    return this.dob
  }

  public setDob(dob: string): void {
    this.dob = dob
  }

  public getAddress(): Address {
    return this.address
  }

  public setAddress(address: Address): void {
    this.address = address
  }

  public isBlock(): boolean {
    return this.block
  }

  public getBlock(): boolean {
    return this.block
  }

  public setBlock(block: boolean): void {
    this.block = block
  }
}
