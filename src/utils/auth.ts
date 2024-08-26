import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AuthenticationError } from "apollo-server-express";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1d" });
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePasswords = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const verifyToken = (token: string): { userId: string } => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (error) {
    throw new AuthenticationError("Invalid or expired token");
  }
};

export const authMiddleware = (req: any) => {
  const token = req.headers.authorization?.split(" ")[1] || "";
  if (token) {
    try {
      const user = verifyToken(token);
      req.user = user;
    } catch (error) {
      console.error("Authentication error:", error);
    }
  }
  return req;
};
