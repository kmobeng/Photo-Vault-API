import { Document, model, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

export interface IUser extends Document {
  name: string;
  email: string;
  username: string;
  password: string;
  passwordConfirm?: string;
  createdAt: Date;
  role: string;
  passwordChangedAt?: Date;

  signToken(): string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number): boolean;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: [true, "name is required"] },
  email: {
    type: String,
    unique: true,
    required: [true, "email is required"],
    trim: true,
    lowercase: true,
    validate: {
      validator: function (value: string) {
        return validator.isEmail(value);
      },
      message: "Please provide a valid email",
    },
  },
  username: {
    type: String,
    required: [true, "username is required. Please provide!"],
    unique: true,
    trim: true,
    validate: {
      validator: function (value: string) {
        for (const char of value) {
          if (!validator.isAlphanumeric(char) && char !== "_" && char !== ".") {
            return false;
          }
        }
        if (value[value.length - 1] === ".") {
          return false;
        }
        return true;
      },
      message:
        "invalid username format. username must contain alphabets,numbers,underscore,full-stop and must not end with a full-stop",
    },
  },
  password: {
    type: String,
    required: [true, "You must provide password"],
    minlength: [8, "Password is should be 8 characters or more"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "You must confirm password"],
    validate: {
      validator: function (this: any, value: string): boolean {
        return value === this.password;
      },
      message: "Password must match",
    },
  },
  role: { type: String, default: "user", enum: ["user", "admin"] },
  passwordChangedAt: Date,
});

UserSchema.pre("save", async function (this: any) {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

UserSchema.methods.signToken = function () {
  return JWT.sign({ id: this._id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN!,
  } as JWT.SignOptions);
};

UserSchema.methods.comparePassword = async function (
  this: IUser,
  candidatePassword: string
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.changedPasswordAfter = function (JWTTimestamp: any) {
  if (this.passwordChangedAt) {
    const changedTimestamp: any = this.passwordChangedAt.getTime() / 1000;
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = model<IUser>("User", UserSchema);

export default User;
