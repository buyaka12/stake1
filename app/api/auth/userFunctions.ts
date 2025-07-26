'use server';
import {UserModel} from "@/app/api/auth/UserModel";

import dbConnect from "@/lib/mongodb";
import UserSchema from "@/app/db/schema/UserSchema";
import bcrypt from "bcryptjs";



export async function fetchUser(identifier: string): Promise<UserModel | null> {
  await dbConnect();

  try {
    const user = await UserSchema.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
  }
  return null;
}

export async function updateBalance(username: string, newBalance: number): Promise<Omit<UserModel, 'password'> | null> {
  await dbConnect();

  try {
    const user = await UserSchema.findOne({ username });

    if (!user) {
      console.log(`User '${username}' not found.`);
      return null;
    }
    user.wallet.balance = newBalance;
    const updatedUser = await user.save();
    const userObject = updatedUser.toObject();
    delete userObject.password;
    return userObject;
  } catch (error) {
    console.error("Error updating user balance:", error);
    throw new Error("Could not update user balance.");
  }
}




export async function createUser(userModel: Pick<UserModel, 'username' | 'password' | 'email'>): Promise<Omit<UserModel, 'password'>> {
  await dbConnect();

  // Check if a user with this username already exists
  const existingUser = await UserSchema.findOne({ username: userModel.username });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(userModel.password, 10);
  const wallet = generateWallet();

  const newUser = new UserSchema({
    username: userModel.username,
    email: userModel.email,
    password: hashedPassword,
    wallet: wallet,
  });

  const savedUser = await newUser.save();
  const userObject = savedUser.toObject();
  delete userObject.password;

  return userObject;
}

function generateWallet() {
  const hex = [...Array(16)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  return {
    address: `wallet_${hex}`,
    balance: 1000,
  };
}
