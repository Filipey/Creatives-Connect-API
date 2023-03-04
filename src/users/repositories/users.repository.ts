import { Injectable } from '@nestjs/common';
import { UserAlreadyExists } from 'src/common/errors/UserAlreadyExists';
import { UserAlreadyFollow } from 'src/common/errors/UserAlreadyFollow';
import { UserDontFollow } from 'src/common/errors/UserDontFollow';
import { UserNotFound } from 'src/common/errors/UserNotFound';
import { Neo4JService } from 'src/database/database.service';
import { hashPassword } from 'src/utils/Bcrypt';
import { CreateUserInput } from '../models/create-user-input';

@Injectable()
export class UsersRepository {
  constructor(private readonly service: Neo4JService) {}

  private async isFollowing(sourceUsername: string, sinkUsername: string) {
    const isAlreadyFollowing = await this.service.read(`
    MATCH (u:User {username: '${sourceUsername}'})-[f:FOLLOW]->(u2:User {username: '${sinkUsername}'}) 
    RETURN f
  `);

    if (isAlreadyFollowing.length === 0) return false;

    if (isAlreadyFollowing.length > 0) return true;

    return false;
  }

  async findByUsername(username: string) {
    const result = await this.service.read(
      `MATCH (u:User) WHERE u.username = '${username}' RETURN u`,
    );

    return result;
  }

  async findAll() {
    const result = await this.service.read(`
    MATCH (u:User) RETURN u
    `);

    return result;
  }

  async followUser(sourceUsername: string, sinkUsername: string) {
    const isAlreadyFollowing = await this.isFollowing(
      sourceUsername,
      sinkUsername,
    );

    if (isAlreadyFollowing) {
      throw new UserAlreadyFollow(sourceUsername, sinkUsername);
    }

    const result = await this.service.write(
      `MATCH (source:User), (sink:User)
       WHERE source.username = '${sourceUsername}' AND sink.username = '${sinkUsername}'
       CREATE (source)-[f:FOLLOW]->(sink)
       RETURN type(f)
      `,
    );

    return result;
  }

  async unfollowUser(sourceUsername: string, sinkUsername: string) {
    const isFollowing = await this.isFollowing(sourceUsername, sinkUsername);

    if (!isFollowing) {
      throw new UserDontFollow(sourceUsername, sinkUsername);
    }

    const result = await this.service.write(
      `MATCH (source:User)-[f:FOLLOW]->(sink:User)
       WHERE source.username = '${sourceUsername}' AND sink.username = '${sinkUsername}'
       DELETE f
      `,
    );

    return result;
  }

  async create(user: CreateUserInput) {
    const queryUser = await this.service.read(
      `MATCH (u:User) WHERE u.username = '${user.username}' RETURN u`,
    );

    if (queryUser.length !== 0) {
      throw new UserAlreadyExists(user.username);
    }

    const hashedPassword = await hashPassword(user.password);

    const result = await this.service.write(
      `CREATE (u:User {username: '${user.username}', name: '${
        user.name
      }', password: '${hashedPassword}', biography: '${
        user.biography
      }', picture: '${user.picture}', city: '${user.city}', birthday: ${
        user.birthday
      }, created_at: ${Date.now()}}) RETURN u`,
    );

    return result[0].get(0).properties;
  }

  async delete(username: string) {
    const userExists = await this.service.read(`
    MATCH (u: User {username: '${username}'}) RETURN u
    `);

    if (userExists.length === 0) {
      throw new UserNotFound(username);
    }

    await this.service.write(`
    MATCH (u:User {username: '${username}'})
    DELETE u
    `);

    return true;
  }
}
