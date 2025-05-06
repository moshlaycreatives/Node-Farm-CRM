export class CustomErrorException extends Error {
  constructor(statusCode, message, error, ...rest) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
    Object.assign(this, rest);
  }
}
