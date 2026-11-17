import { Action } from 'routing-controllers';
import { Config } from '../../config/Config';
import { Constants } from '../../common/utils/Constants';
const jwt = require('jwt-simple');

export class AuthorizationChecker {
  public static extractJWTToken(action: Action): string | null {
    const authHeader = action.request.headers[Constants.AUTH_HEADER] || action.request.headers['authorization'];
    if (!authHeader) {
      return null;
    }
    return (authHeader as string).replace(Constants.TOKEN_PREFIX, '').trim();
  }

  public async check(action: Action, roles?: string[]): Promise<boolean> {
    const token = AuthorizationChecker.extractJWTToken(action);
    if (!token) {
      return false;
    }

    try {
      const decoded = jwt.decode(token, Config.getInstance().getJwtSecret());
      action.request.user = decoded;
      return true;
    } catch (err) {
      return false;
    }
  }

  public async getCurrentUserClaims(action: Action): Promise<any> {
    return action.request.user;
  }
}
