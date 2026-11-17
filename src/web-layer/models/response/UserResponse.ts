import { User } from '../../../service-layer/models/User';

export class UserResponse {
  public id: string | null;
  public _id: string | null;
  public phone: string;
  public phone_no: string;
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
  public order?: Array<any>;

  constructor(user: User) {
    if (!user) return;
    this.id = user.getId();
    this._id = user.getRefId() || user.getId();
    this.phone = user.getPhone();
    this.phone_no = user.getPhone();
    this.status = user.getStatus();
    this.refId = user.getRefId();
    this.email = user.getEmail();
    this.dob = user.getDob();

    const addr = user.getAddress();
    this.address = addr
      ? {
          city: typeof addr.getCity === 'function' ? addr.getCity() : (addr as any).city,
          district: typeof addr.getDistrict === 'function' ? addr.getDistrict() : (addr as any).district,
          state: typeof addr.getState === 'function' ? addr.getState() : (addr as any).state,
          country: typeof addr.getCountry === 'function' ? addr.getCountry() : (addr as any).country,
        }
      : {};

    this.block = user.getBlock();
    this.createdAt = user.getCreatedAt();
    this.updatedAt = user.getUpdatedAt();

    // Backward-compatibility for EJS views
    this.order = [
      {
        _id: this._id,
        email: this.email,
        DOB: this.dob,
        block: this.block,
        address: this.address,
      },
    ];
  }
}
