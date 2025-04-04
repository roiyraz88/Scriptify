import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: string): string => {
  const secret = process.env.JWT_ACCESS_SECRET;
  const expiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN;

  if (!secret || !expiresIn) {
    throw new Error("Missing JWT access config");
  }

  return jwt.sign({ userId }, secret, {
    expiresIn: expiresIn as unknown as jwt.SignOptions["expiresIn"]
  });
  
};

export const generateRefreshToken = (userId: string): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  const expiresIn = process.env.JWT_REFRESH_TOKEN_EXPIRES_IN;

  if (!secret || !expiresIn) {
    throw new Error("Missing JWT refresh config");
  }

  return jwt.sign({ userId }, secret, {
    expiresIn: expiresIn as unknown as jwt.SignOptions["expiresIn"]
  });
  
};
