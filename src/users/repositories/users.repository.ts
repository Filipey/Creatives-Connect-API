import { Injectable } from '@nestjs/common';
import { UserAlreadyExists } from 'src/common/errors/UserAlreadyExists';
import { UserNotFound } from 'src/common/errors/UserNotFound';
import { Neo4JService } from 'src/database/database.service';
import { hashPassword } from 'src/utils/Bcrypt';
import { CreateUserInput } from '../models/create-user-input';

@Injectable()
export class UsersRepository {
  constructor(private readonly service: Neo4JService) {}

  async findByUsername(username: string) {
    const result = await this.service.read(
      `MATCH (u:User) WHERE u.username = '${username}' RETURN u`,
    );

    if (result.length === 0) {
      throw new UserNotFound(username);
    }

    return result[0].get(0).properties;
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
}
