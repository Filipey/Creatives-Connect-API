import { Module } from '@nestjs/common';
import { Neo4JService } from 'src/database/database.service';
import { UserRepository } from './repositories/users.repository';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [],
  providers: [UsersService, UsersResolver, Neo4JService, UserRepository],
})
export class UsersModule {}
