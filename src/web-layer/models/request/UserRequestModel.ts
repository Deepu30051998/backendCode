export class UserRequestModel {
  id:string
  phoneNumber: string 
  password: string
  email: string
  dob: string
  address:Address
  status:string 
  enable:boolean 
}

export class Address {
  city: string
  district: string
  state: string
  country: string
}

