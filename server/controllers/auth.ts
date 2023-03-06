import type { Response } from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

interface IRegisterRequest {
  body: IRegisterRequestBody;
}

interface IRegisterRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  picturePath: string;
  friends: any[];
  location: string;
  occupation: string;
}

interface ILoginRequest {
  body: ILoginRequestBody;
}

interface ILoginRequestBody {
  email: string;
  password: string;
}

/* REGISTER USER */
export const register = async (req: IRegisterRequest, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

/* LOGIN */

export const login = async (req: ILoginRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string);
    // @ts-ignore
    delete user.password;
    res.status(200).json({ token, user });
  } catch (e) {}
};
