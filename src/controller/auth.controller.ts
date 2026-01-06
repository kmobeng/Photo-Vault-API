import { Request, Response, NextFunction } from "express";
import { createError } from "../utils/error.util";
import { loginService, signUpService } from "../services/auth.service";
import JWT from "jsonwebtoken";
import User, { IUser } from "../model/user.model";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

interface JWTPayload {
  id: string;
  iat: number;
  exp: number;
}

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, username, password, passwordConfirm, role } = req.body;

    const fetchedUser = await signUpService(
      name,
      email,
      username,
      password,
      passwordConfirm,
      role
    );

    const token = fetchedUser.signToken();

    const user: any = fetchedUser.toObject();
    delete user.password;

    res.status(201).json({ status: "success", token, data: { user } });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw createError("Please enter email and password", 400);
    }

    const fetchedUser = await loginService(email, password);
    const token = fetchedUser.signToken();

    const user: any = fetchedUser.toObject();
    delete user.password;

    res.status(200).json({ status: "success", token, data: { user } });
  } catch (error) {
    next(error);
  }
};

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: any;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw createError("You are not logged in. Please login to continue", 401);
    }

    const decoded = JWT.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    const currentUser = await User.findById(decoded.id).select("+password");

    if (!currentUser) {
      throw createError("The user with this token does not exist", 404);
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      throw createError("Password changed. Please login again", 400);
    }

    req.user = currentUser;

    next();
  } catch (error) {
    next(error);
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        createError("You do not have permission to accesss this action", 403)
      );
    }
    next();
  };
};
