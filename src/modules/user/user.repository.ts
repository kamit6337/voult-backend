import { ClientSession } from "mongoose";
import { UserModel } from "./user.model.js";
import type { CreateUserRepoType, User } from "./user.types.js";

class UserRepository {
  async findByEmail(email: string) {
    return UserModel.findOne({
      email,
      deletedAt: null,
    });
  }

  async create(data: CreateUserRepoType, session?: ClientSession) {
    return UserModel.create([data], { session });
  }

  async findById(id: string) {
    return UserModel.findById(id);
  }
}

export const userRepository = new UserRepository();
