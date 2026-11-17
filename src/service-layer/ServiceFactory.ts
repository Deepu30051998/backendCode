import { IUserService } from './interfaces/IUserService'

export class ServiceFactory {
  private static userService: IUserService

  public static getUserService(): IUserService {
    return this.userService
  }

  public static setUserService(userService: IUserService): void {
    this.userService = userService
  }
}
