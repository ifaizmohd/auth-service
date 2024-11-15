export interface IUser {
  id: string;
  roles: string[];
  [key: string]: unknown;
}
