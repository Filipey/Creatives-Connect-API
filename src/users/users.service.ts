import { Injectable } from '@nestjs/common';
import { UserNotFound } from 'src/common/errors/UserNotFound';
import { parseDbInt } from 'src/utils/DbParser';
import { CreateUserInput } from './models/create-user-input';
import { UpdateUserInput } from './models/update-user-input';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async isUserFollowing(sourceUsername: string, sinkUsername: string) {
    return this.repository.isFollowing(sourceUsername, sinkUsername);
  }

  async findByUsername(username: string) {
    const result = await this.repository.findByUsername(username);

    if (result.length === 0) {
      throw new UserNotFound(username);
    }

    const userNode = result[0].get(0).properties;

    return {
      ...userNode,
      createdAt: parseDbInt(userNode.created_at),
      birthday: parseDbInt(userNode.birthday),
    };
  }

  async findAllUsers() {
    const result = await this.repository.findAll();

    const nodes = result.map((user) => user.toObject());

    const users = nodes.map((node) => ({
      ...node.u.properties,
      createdAt: parseDbInt(node.u.properties.created_at),
      birthday: parseDbInt(node.u.properties.birthday),
    }));

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

    const nodes = result.map((node) => node.get('u').properties);

    const followers = nodes.map((user) => ({
      ...user,
      createdAt: parseDbInt(user.created_at),
      birthday: parseDbInt(user.birthday),
    }));

    return followers;
  }

  async findFollowedsByUser(username: string) {
    const result = await this.repository.findFollowedsByUser(username);

    const nodes = result.map((node) => node.get('u2').properties);

    const followers = nodes.map((user) => ({
      ...user,
      createdAt: parseDbInt(user.created_at),
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

  async update(username: string, user: UpdateUserInput) {
    const result = await this.repository.update(username, user);

    const updatedNode = result[0].get(0).properties;

    return {
      ...updatedNode,
      createdAt: parseDbInt(updatedNode.created_at),
      birthday: parseDbInt(updatedNode.birthday),
    };
  }
}
