import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      });
    }
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
      return res.status(400).json({ message: "Invalid name" });
    }
    if (name.length < 2) {
      return res
        .status(400)
        .json({ message: "Name must be at least 2 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      scripts: [],
    });

    return res
      .status(201)
      .json({ message: "Registraition is succesful!", user: newUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  const user: IUser | null = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Email not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ message: "Email or password is incorrect" });

  const accessToken = generateAccessToken(user.id.toString());
  const refreshToken = generateRefreshToken(user.id.toString());

  user.refreshToken = refreshToken;
  await user.save();

  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        scripts: user.scripts,
      },
    });
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "Refresh token is not valid" });
    }

    let payload: jwt.JwtPayload;
    try {
      payload = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET as string
      ) as jwt.JwtPayload;
    } catch (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const user = await User.findById(payload.userId);
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Expired refresh token" });
    }

    const newAccessToken = generateAccessToken(user.id.toString());

    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Server error in refreshToken:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res
        .status(400)
        .json({ message: "Please provide a refresh token" });
    }

    const user = await User.findOne({ refreshToken: token });
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    user.refreshToken = "";
    await user.save();

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Error in logging out", err);
    return res.status(500).json({ message: "Error in logging out" });
  }
};
