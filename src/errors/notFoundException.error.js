import { CustomErrorException } from "./customException.error.js";

// ===================================================================================
// 404. Not Found - Use when the requested resource could not be found on the server.
// ===================================================================================
export class NotFoundException extends CustomErrorException {
  constructor(message, ...rest) {
    super(404, message, "NotfoundException", ...rest);
  }
}
