export class ApiResponce {
  constructor({ statusCode = 200, message = "Success", ...rest }) {
    this.success = statusCode < 400;
    this.message = message;
    Object.assign(this, rest);
  }
}
