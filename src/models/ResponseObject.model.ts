export class ResponseObject<T = object> {
  message: string;
  httpStatus: number;
  payload?: T;

  constructor(message: string, httpStatus: number, payload?: T) {
    this.message = message;
    this.httpStatus = httpStatus;
    this.payload = payload;
  }
}
