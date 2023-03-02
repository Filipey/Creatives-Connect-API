import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './models/create-user-input';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async findByUsername(username: string) {
    return this.repository.findByUsername(username);
  }

  async create(user: CreateUserInput) {
    return this.repository.create(user);
  }
}
