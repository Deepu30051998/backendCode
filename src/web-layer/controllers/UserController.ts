import { Body, Get, JsonController, Param, Post, QueryParam } from 'routing-controllers'
import { ServiceFactory } from '../../service-layer/ServiceFactory'
import { IUserService } from '../../service-layer/interfaces/IUserService'
import { UserRequestModel } from '../models/request/UserRequestModel'
import { Config } from '../../config/Config'
import { User } from '../../service-layer/models/User'
import { Utility } from '../../common/utils/Utility'
const jwt = require('jwt-simple')

@JsonController('/users')
export class UserController {
  private readonly userService: IUserService

  constructor() {
    this.userService = ServiceFactory.getUserService()
  }

  @Post('/add')
  public async addUser(@Body() req: UserRequestModel): Promise<User> {
    if (!req.phoneNumber) {
      throw new Error('Invalid phone number')
    }
    if (!req.password) {
      throw new Error('Invalid password')
    }
    return await this.userService.createUser(Utility.getUser(req))
  }

  @Post('/login')
  public async login(@Body() req: UserRequestModel): Promise<{ token: string; user: User }> {
    if (!req.phoneNumber) {
      throw new Error('Invalid phone number')
    }
    if (!req.password) {
      throw new Error('Invalid password')
    }
    const verifiedUser = await this.userService.verifyUser(req.phoneNumber, req.password)
    if (!verifiedUser) {
      throw new Error('Invalid phone number or password')
    }
    const payload = {
      id: verifiedUser.getId(),
      phone: verifiedUser.getPhoneNumber(),
      exp: Math.floor(Date.now() / 1000) + Config.getInstance().getJwtExpiry(),
    }
    const token = jwt.encode(payload, Config.getInstance().getJwtSecret())
    return { token, user: verifiedUser }
  }

  @Post('/update')
  public async updateUser(@Body() req: UserRequestModel): Promise<boolean> {
    if (!Utility.isValidMongoId(req.id)) {
      throw new Error('Invalid user id')
    }
    return await this.userService.updateUser(Utility.getUser(req))
  }

  @Post('/toggle')
  public async toggleUser(@Body() req: UserRequestModel): Promise<boolean> {
    if (!Utility.isValidMongoId(req.id)) {
      throw new Error('Invalid user id')
    }
    return await this.userService.toggleUser(req.id, req.enable)
  }

  @Get('/delete/:id')
  public async deleteUser(@Param('id') id: string): Promise<boolean> {
    return await this.userService.deleteUser(id)
  }

  @Get('/list')
  public async getAllUsers(): Promise<User[]> {
    return await this.userService.getAllUsers()
  }

  @Get('/getUsersByPhoneNumber')
  public async getUsersByPhoneNumber(@QueryParam('phoneNumber') phoneNumber: string): Promise<User[]> {
    return await this.userService.getUsersByPhoneNumber(phoneNumber)
  }
}
