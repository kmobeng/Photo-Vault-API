import { IUser } from "../../model/user.model"; 

declare global {
  namespace Express {
    interface User extends IUser {}
    interface Request {
      currentUser: IUser;
    }
  }
}

export {};