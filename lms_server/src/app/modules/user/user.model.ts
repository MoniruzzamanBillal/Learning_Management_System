import bcrypt from "bcrypt";
import { model, Schema } from "mongoose";
import config from "../../config";
import { UserRole } from "./user.constants";
import { TUser } from "./user.interface";

const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: [true, "user name is required "],
    },
    email: {
      type: String,
      required: [true, "user email is required "],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "user password is required "],
    },
    profilePicture: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    needsPasswordChange: {
      type: Boolean,
      default: false,
    },
    userRole: {
      type: String,
      default: UserRole.user,
    },
  },
  {
    timestamps: true,
  }
);

// ! hash password
userSchema.pre("save", async function (next) {
  const user = this;

  user.password = await bcrypt.hash(
    user?.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});

userSchema.pre("find", async function (next) {
  this.where({ isDeleted: false });
  next();
});

userSchema.pre("findOne", async function (next) {
  // this.find({ isDeleted: { $ne: true } });
  this.where({ isDeleted: false });
  next();
});

//
export const userModel = model<TUser>("User", userSchema);
