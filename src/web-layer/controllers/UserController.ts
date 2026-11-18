import { Body, Delete, Get, JsonController, Param, Post, Put, QueryParam } from 'routing-controllers'
import { ServiceFactory } from '../../service-layer/ServiceFactory'
import { IUserService } from '../../service-layer/interfaces/IUserService'
import { UserRequestModel } from '../models/request/UserRequestModel'
import { UserResponse } from '../models/response/UserResponse'
import { ApiResponse } from '../models/response/ApiResponse'
import { Config } from '../../config/Config'
const jwt = require('jwt-simple')

@JsonController('/users')
export class UserController {
  private readonly userService: IUserService

  constructor() {
    this.userService = ServiceFactory.getUserService()
  }

  @Post('/register')
  public async register(@Body({ required: true }) req: UserRequestModel): Promise<ApiResponse<UserResponse>> {
    const user = await this.userService.registerUser(req)
    return ApiResponse.ok(new UserResponse(user), 'User registered successfully')
  }

  @Post('/login')
  public async login(@Body() req: UserRequestModel): Promise<ApiResponse<{ token: string, user: UserResponse }>> {
    const user = await this.userService.authenticate(req.phoneNumber, req.password)
    if (!user) {
      return ApiResponse.fail('Invalid phone number or password') as any
    }

    const payload = {
      id: user.getId(),
      phone: user.getPhoneNumber(),
      exp: Math.floor(Date.now() / 1000) + Config.getInstance().getJwtExpiry(),
    }
    const token = jwt.encode(payload, Config.getInstance().getJwtSecret())

    return ApiResponse.ok(
      {
        token,
        user: new UserResponse(user),
      },
      'Login successful'
    )
  }

  @Get('/')
  public async getAllUsers(): Promise<ApiResponse<UserResponse[]>> {
    const users = await this.userService.getAllUsers()
    return ApiResponse.ok(users.map((u) => new UserResponse(u)))
  }

  @Get('/by-phone')
  public async getUserByPhone(@QueryParam('phone') phone: string): Promise<ApiResponse<UserResponse[]>> {
    const users = await this.userService.getUserWithDetails(phone)
    return ApiResponse.ok(users.map((u) => new UserResponse(u)))
  }

  @Put('/')
  public async updateUser(@Body({ required: true }) req: UserRequestModel): Promise<ApiResponse<boolean>> {
    const result = await this.userService.updateUser(req)
    if (!result) {
      return ApiResponse.fail('User not found or update failed') as any
    }
    return ApiResponse.ok(true, 'User updated successfully')
  }

  @Delete('/:refId')
  public async deleteUser(@Param('refId') refId: string): Promise<ApiResponse<boolean>> {
    await this.userService.deleteUser(refId)
    return ApiResponse.ok(true, 'User deleted successfully')
  }

  @Post('/toggle-block/:refId')
  public async toggleBlockUser(@Param('refId') refId: string): Promise<ApiResponse<{ isBlocked: boolean }>> {
    const newState = await this.userService.toggleBlockUser(refId)
    if (newState === null) {
      return ApiResponse.fail('User details not found') as any
    }
    return ApiResponse.ok({ isBlocked: newState }, 'User block state toggled')
  }
}
