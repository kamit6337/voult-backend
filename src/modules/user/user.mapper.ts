import { UserResponseType } from "./user.response.js";
import { UserDocument } from "./user.types.js";

export function toUserResponseDto(user: UserDocument): UserResponseType {
  return {
    _id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
  };
}
