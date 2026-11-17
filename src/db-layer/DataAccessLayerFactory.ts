import { IUserDBManager } from './interfaces/IUserDBManager'

export class DataAccessLayerFactory {
  private static userDBManager: IUserDBManager

  public static getUserDBManager(): IUserDBManager {
    return this.userDBManager
  }

  public static setUserDBManager(mgr: IUserDBManager): void {
    this.userDBManager = mgr
  }
}
