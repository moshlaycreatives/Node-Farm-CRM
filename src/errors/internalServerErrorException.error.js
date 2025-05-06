import { CustomErrorException } from "./customException.error.js";

// ===================================================================================
// 500: Internal Server Error - Use when the server encounters an unexpected condition
//      that prevents it from fulfilling the request.
// ===================================================================================
export class InternalServerErrorException extends CustomErrorException {
  constructor(message, ...rest) {
    super(500, message, "InternalServerErrorException", ...rest);
  }
}
