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

export type userSession = {
  createdAt: number;
};

export type sessionStore = Record<string, userSession>;
