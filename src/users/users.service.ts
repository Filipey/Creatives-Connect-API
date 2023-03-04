import { Injectable } from '@nestjs/common';
import { UserNotFound } from 'src/common/errors/UserNotFound';
import { parseDbInt } from 'src/utils/DbParser';
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

  async findUserFollowers(username: string) {
    const result = await this.repository.findUserFollowers(username);

    const nodes = result.map((node) => node.get('u'));

    const followers = nodes.map((user) => ({
      ...user,
      createdAt: parseDbInt(user.createdAt),
      birthday: parseDbInt(user.birthday),
    }));

    return followers;
  }

  async findFollowedsByUser(username: string) {
    const result = await this.repository.findFollowedsByUser(username);

    const nodes = result.map((node) => node.get('u'));

    const followers = nodes.map((user) => ({
      ...user,
      createdAt: parseDbInt(user.createdAt),
      birthday: parseDbInt(user.birthday),
    }));

    return followers;
  }

  async create(user: CreateUserInput) {
    return this.repository.create(user);
  }

  async delete(username: string) {
    return this.repository.delete(username);
  }

  async update(username: string, user: CreateUserInput) {
    const result = await this.repository.update(username, user);

    return result[0].get(0).properties;
  }
}
