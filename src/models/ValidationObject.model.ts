export class ValidationObject {
  isValid: boolean;
  message: string;
  field?: string;

  constructor(isValid: boolean, message: string, field?: string) {
    this.isValid = isValid;
    this.message = message;
    this.field = field;
  }
}
