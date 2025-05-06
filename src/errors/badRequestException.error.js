import { CustomErrorException } from "./customException.error.js";

// ===================================================================================
// 400. Bad Request - Use when the client sends an invalid request or incorrect data.
// ===================================================================================
export class BadRequestException extends CustomErrorException {
  constructor(message, ...rest) {
    super(400, message, "BadRequestException", ...rest);
  }
}
