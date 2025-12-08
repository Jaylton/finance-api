import { UserRepositoryPort } from "../ports/user.repository.port";
import { User } from "../entities/user.entity";
import { PasswordHasherPort } from "../ports/password-hasher.port";

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async execute(input: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    const hashedPassword = await this.passwordHasher.hash(input.password);

    const user = new User(
      crypto.randomUUID(),
      input.name,
      input.email,
      hashedPassword,
    );

    await this.userRepository.create(user);

    return user;
  }
}