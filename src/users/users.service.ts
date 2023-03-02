import { Injectable } from '@nestjs/common';
import { User } from './models/user-model';
import { UserRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UserRepository) {}

  async findByUsername(username: string) {
    return this.repository.findByUsername(username);
  }

  async create(user: User) {
    return this.repository.create(user);
  }
}
