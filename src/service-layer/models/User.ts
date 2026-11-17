export interface IUserData {
  id?: string | null;
  phone: string;
  pass?: string;
  status?: boolean;
  refId?: string | null;
  email?: string;
  dob?: string;
  address?: {
    city?: string;
    district?: string;
    state?: string;
    country?: string;
  };
  block?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private id: string | null;
  private phone: string;
  private pass?: string;
  private status: boolean;
  private refId: string | null;
  private email?: string;
  private dob?: string;
  private address: {
    city?: string;
    district?: string;
    state?: string;
    country?: string;
  };
  private block: boolean;
  private createdAt?: Date;
  private updatedAt?: Date;

  constructor(data: IUserData) {
    this.id = data.id || null;
    this.phone = data.phone;
    this.pass = data.pass;
    this.status = data.status !== undefined ? data.status : true;
    this.refId = data.refId || null;
    this.email = data.email;
    this.dob = data.dob;
    this.address = data.address || {};
    this.block = data.block !== undefined ? data.block : false;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  public getId(): string | null {
    return this.id;
  }

  public getPhone(): string {
    return this.phone;
  }

  public getPass(): string | undefined {
    return this.pass;
  }

  public getStatus(): boolean {
    return this.status;
  }

  public getRefId(): string | null {
    return this.refId;
  }

  public getEmail(): string | undefined {
    return this.email;
  }

  public getDob(): string | undefined {
    return this.dob;
  }

  public getAddress(): { city?: string; district?: string; state?: string; country?: string } {
    return this.address;
  }

  public getBlock(): boolean {
    return this.block;
  }

  public getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  public getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }

  public setBlock(block: boolean): void {
    this.block = block;
  }

  public setStatus(status: boolean): void {
    this.status = status;
  }
}
