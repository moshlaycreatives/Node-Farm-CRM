import { CustomErrorException } from "./customException.error.js";

// ==========================================================================================================
// 422. Unprocessable Entity - Use when the server understands the content type but cannot process the data.
// ==========================================================================================================
export class UnProcessableException extends CustomErrorException {
  constructor(message, ...rest) {
    super(422, message, "UnProcessableException", ...rest);
  }
}
