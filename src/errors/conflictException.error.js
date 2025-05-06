import { CustomErrorException } from "./customException.error.js";

// =======================================================================================
// 409. Conflict - Use when there is a conflict in the request, such as an edit conflict.
// =======================================================================================
export class ConflictException extends CustomErrorException {
  constructor(message, ...rest) {
    super(409, message, "ConflictException", ...rest);
  }
}
