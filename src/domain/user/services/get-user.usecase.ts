import { UserRepositoryPort } from "../ports/user.repository.port";
import { User } from "../entities/user.entity";

export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }
}