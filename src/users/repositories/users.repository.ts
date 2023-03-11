import { Injectable } from '@nestjs/common';
import { UserAlreadyExists } from 'src/common/errors/UserAlreadyExists';
import { UserAlreadyFollow } from 'src/common/errors/UserAlreadyFollow';
import { UserDontFollow } from 'src/common/errors/UserDontFollow';
import { UserNotFound } from 'src/common/errors/UserNotFound';
import { Neo4JService } from 'src/database/database.service';
import { hashPassword } from 'src/utils/Bcrypt';
import { CreateUserInput } from '../models/create-user-input';
import { UpdateUserInput } from '../models/update-user-input';

@Injectable()
export class UsersRepository {
  constructor(private readonly service: Neo4JService) {}

  async isFollowing(sourceUsername: string, sinkUsername: string) {
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

  async findUserFollowers(username: string) {
    const result = await this.service.read(`
    MATCH (u:User)-[:FOLLOW]->(u2:User {username: '${username}'})
    RETURN u
    `);

    return result;
  }

  async findFollowedsByUser(username: string) {
    const result = await this.service.read(`
    MATCH (u:User {username: '${username}'})-[:FOLLOW]->(u2:User)
    RETURN u2
    `);

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
      }, created_at: ${Date.now() - 1000 * 3600 * 3}}) RETURN u`,
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
    DETACH DELETE u
    `);

    return true;
  }

  async update(username: string, updateUser: UpdateUserInput) {
    const queryUser = await this.service.read(`
    MATCH (u:User {username: '${username}'})
    RETURN u
    `);

    if (queryUser.length === 0) {
      throw new UserNotFound(username);
    }

    const originalUser = queryUser[0].get('u').properties;

    const password = updateUser.password
      ? await hashPassword(updateUser.password)
      : originalUser.password;

    const updatedUser = await this.service.write(`
    MATCH(u:User {username: '${username}'})
    SET u.name = '${
      updateUser.name ? updateUser.name : originalUser.name
    }', u.biography = '${
      updateUser.biography ? updateUser.biography : originalUser.biography
    }',
    u.picture = '${
      updateUser.picture ? updateUser.picture : updateUser.picture
    }', u.city = '${updateUser.city ? updateUser.city : originalUser.city}',
    u.birthday = ${
      updateUser.birthday ? updateUser.birthday : originalUser.birthday
    },
    u.password = '${password}'
    RETURN u
    `);

    return updatedUser;
  }
}
