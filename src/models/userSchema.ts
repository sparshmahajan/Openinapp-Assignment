import mongoose, { ObjectId } from "mongoose";
import { getToken } from "../security/jwt";
import { UserPriorityEnums } from "../enums/userPriorityEnum";

interface UserAttrs {
  phone_number: string;
  priority: UserPriorityEnums;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

export interface UserDoc extends mongoose.Document {
  id: ObjectId;
  phone_number: string;
  priority: UserPriorityEnums;
  generateToken(): string;
}

const userSchema = new mongoose.Schema<UserDoc>(
  {
    phone_number: {
      type: String,
      required: true,
      unique: true,
    },
    priority: {
      type: Number,
      enum: [
        UserPriorityEnums.LOW,
        UserPriorityEnums.MEDIUM,
        UserPriorityEnums.HIGH,
      ],
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

userSchema.statics.build = async (attrs: UserAttrs) => {
  const user = new User(attrs);
  await user.save();
  return user.toJSON();
};

userSchema.methods.generateToken = function () {
  const token = getToken({
    id: this.id,
  });
  return token;
};

const User = mongoose.model<UserDoc, UserModel>("user", userSchema);

export { User };
