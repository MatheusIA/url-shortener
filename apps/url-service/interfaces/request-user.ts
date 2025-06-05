import { Request } from 'express';

export interface RequestUser extends Request {
  user: {
    sub: string;
    email: string;
    iat: number;
    exp: number;
  };
}
