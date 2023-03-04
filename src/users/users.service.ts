import { Injectable } from '@nestjs/common';
import { UserNotFound } from 'src/common/errors/UserNotFound';
import { CreateUserInput } from './models/create-user-input';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async findByUsername(username: string) {
    const result = await this.repository.findByUsername(username);

    if (result.length === 0) {
      throw new UserNotFound(username);
    }

    return result[0].get(0).properties;
  }

  async findAllUsers() {
    const result = await this.repository.findAll();

    const nodes = result.map((user) => user.toObject());

    const users = nodes.map((node) => node.u.properties);

    return users;
  }

  async followUser(sourceUsername: string, sinkUsername: string) {
    const result = await this.repository.followUser(
      sourceUsername,
      sinkUsername,
    );

    if (result.length === 1) return true;

    return false;
  }

  async unfollowUser(sourceUsername: string, sinkUsername: string) {
    const result = await this.repository.unfollowUser(
      sourceUsername,
      sinkUsername,
    );

    if (result.length === 0) return true;

    return false;
  }

  async create(user: CreateUserInput) {
    return this.repository.create(user);
  }

  async delete(username: string) {
    return this.repository.delete(username);
  }
}
