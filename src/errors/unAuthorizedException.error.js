import { CustomErrorException } from "./customException.error.js";

// ======================================================================================
// 401. UnAuthorized - Indicates that a request failed because the client did not provide
//      valid authentication credentials
// ======================================================================================
export class UnAuthorizedException extends CustomErrorException {
  constructor(message, ...rest) {
    super(401, message, "UnAuthorizedException", ...rest);
  }
}
