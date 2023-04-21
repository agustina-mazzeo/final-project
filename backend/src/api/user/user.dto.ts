import { User } from '../../interfaces/user.interface';
export interface UserResponseDTO {
  name?: string;
  email: string;
}
export const userToResponseDTO = (user: User) => {
  const userDto: UserResponseDTO = { name: user.name, email: user.email };
  return userDto;
};
