import { AppError } from "@/shared/errors/app-error.js";
import { toUserResponseDto } from "./user.mapper.js";
import { userRepository } from "./user.repository.js";
import { UserResponseType } from "./user.response.js";

class UserService {
  async getUserById(id: string): Promise<UserResponseType> {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError(400, "Wrong userId provided");
    }

    return toUserResponseDto(user);
  }
}

export const userService = new UserService();
