import { User } from '../../../service-layer/models/User';

export class UserResponse {
  public id: string | null;
  public phone: string;
  public status: boolean;
  public refId: string | null;
  public email?: string;
  public dob?: string;
  public address: {
    city?: string;
    district?: string;
    state?: string;
    country?: string;
  };
  public block: boolean;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(user: User) {
    this.id = user.getId();
    this.phone = user.getPhone();
    this.status = user.getStatus();
    this.refId = user.getRefId();
    this.email = user.getEmail();
    this.dob = user.getDob();
    this.address = user.getAddress();
    this.block = user.getBlock();
    this.createdAt = user.getCreatedAt();
    this.updatedAt = user.getUpdatedAt();
  }
}
