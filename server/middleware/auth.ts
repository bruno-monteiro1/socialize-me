import { Request, Response } from "express";
import jwt from "jsonwebtoken";

interface IVerifyTokenRequest {
  header: (_args: any) => string;
  user: any;
}

export const verifyToken = async (
  req: IVerifyTokenRequest,
  res: Response,
  next: () => Promise<any>
) => {
  try {
    let token = req.header("Authorization");

    if (!token) return res.status(401).send("Unauthorized");

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimStart();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = verified;
    next();
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};
