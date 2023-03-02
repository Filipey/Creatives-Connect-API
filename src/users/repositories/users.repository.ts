import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'src/common/errors/NotFoundError';
import { Neo4JService } from 'src/database/database.service';
import { hashPassword } from 'src/utils/Bcrypt';
import { CreateUserDTO } from '../models/create-user-dto';

@Injectable()
export class UserRepository {
  constructor(private readonly service: Neo4JService) {}

  async findByUsername(username: string) {
    const user = this.service.read(
      `MATCH (u:User) WHERE u.username = ${username} RETURN u`,
    );

    if (!user) {
      throw new NotFoundError(
        `User with username = ${username} does not exists!`,
      );
    }

    return user;
  }

  async create(user: CreateUserDTO) {
    const existsUserWithUsername = this.service.read(
      `MATCH (u:User) WHERE u.username = ${user.username} RETURN u`,
    );

    if (existsUserWithUsername) {
      throw new NotFoundError(
        `User with username = ${user.username} already exists!`,
      );
    }

    const hashedPassword = hashPassword(user.password);

    const savedUser = this.service.write(
      `CREATE (u:User {username: ${user.username}}, name: ${
        user.name
      }, password: ${hashedPassword}, biography: ${user.biography}, picture: ${
        user.picture
      }, city: ${user.city}, birthday: ${
        user.birthday
      }, created_at: ${Date.now()})`,
    );

    return savedUser;
  }
}
