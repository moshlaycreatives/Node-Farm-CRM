import { CustomErrorException } from "./customException.error.js";

// ==========================================================================================
// 403. Forbidden - Use when the server understands the request but refuses to authorize it,
//      usually due to insufficient permissions
// ==========================================================================================
export class ForbiddenException extends CustomErrorException {
  constructor(message, ...rest) {
    super(403, message, "ForbiddenException", ...rest);
  }
}
