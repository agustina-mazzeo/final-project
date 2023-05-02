import { UserOutputDTO } from '../../services/data-transfer-objects';
export interface UserResponseDTO {
  name?: string;
  email: string;
}
export const userToResponseDTO = (user: UserOutputDTO) => {
  const userDto: UserResponseDTO = { name: user.name, email: user.email };
  return userDto;
};
