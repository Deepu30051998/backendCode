"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationChecker = void 0;
const Config_1 = require("../../config/Config");
const Constants_1 = require("../../common/utils/Constants");
const jwt = require('jwt-simple');
class AuthorizationChecker {
    static extractJWTToken(action) {
        const authHeader = action.request.headers[Constants_1.Constants.AUTH_HEADER] || action.request.headers['authorization'];
        if (!authHeader) {
            return null;
        }
        return authHeader.replace(Constants_1.Constants.TOKEN_PREFIX, '').trim();
    }
    async check(action, roles) {
        const token = AuthorizationChecker.extractJWTToken(action);
        if (!token) {
            return false;
        }
        try {
            const decoded = jwt.decode(token, Config_1.Config.getInstance().getJwtSecret());
            action.request.user = decoded;
            return true;
        }
        catch (err) {
            return false;
        }
    }
    async getCurrentUserClaims(action) {
        return action.request.user;
    }
}
exports.AuthorizationChecker = AuthorizationChecker;
