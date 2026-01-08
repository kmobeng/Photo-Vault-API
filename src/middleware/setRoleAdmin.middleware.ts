import { Request, Response, NextFunction } from "express";

export const setRole = (req: Request, res: Response, next: NextFunction) => {
  req.params.role = "admin";
  next();
};
