import { Injectable } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './models/create-user-input';
import { User } from './models/user-model';
import { UsersService } from './users.service';

@Injectable()
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Query(() => User)
  async findUserByUsername(@Args('username') username: string) {
    return this.userService.findByUsername(username);
  }

  @Mutation(() => User)
  async createUser(@Args('userInput') userInput: CreateUserInput) {
    return this.userService.create(userInput);
  }
}