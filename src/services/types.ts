export interface UserType {
  name: string;
  email: string;
  password: string;
}

export type tokenPayload = {
  userId: string;
  iat: number;
  exp: number;
};
