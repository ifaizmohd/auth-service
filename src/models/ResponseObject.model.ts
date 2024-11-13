export class ResponseObject {
  message: string;
  httpStatus: number;
  payload?: unknown;

  constructor(message: string, httpStatus: number, payload?: unknown) {
    this.message = message;
    this.httpStatus = httpStatus;
    this.payload = payload;
  }
}
