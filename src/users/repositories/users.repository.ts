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
    const user = await this.service.read(
      `MATCH (u:User) WHERE u.username = '${username}' RETURN u`,
    );

    if (!user) {
      throw new UserNotFound(username);
    }

    return user;
  }

  async create(user: CreateUserInput) {
    const existUser = await this.findByUsername(user.username);

    if (!existUser) {
      throw new UserAlreadyExists(user.username);
    }

    const hashedPassword = await hashPassword(user.password);

    const savedUser = await this.service.write(
      `CREATE (u:User {username: '${user.username}', name: '${
        user.name
      }', password: '${hashedPassword}', biography: '${
        user.biography
      }', picture: '${user.picture}', city: '${user.city}', birthday: ${
        user.birthday
      }, created_at: ${Date.now()}})`,
    );

    return savedUser;
  }
}
