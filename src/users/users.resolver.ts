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

  @Mutation(() => Boolean)
  async followUser(
    @Args('sourceUsername') sourceUsername: string,
    @Args('sinkUsername') sinkUsername: string,
  ) {
    return this.userService.followUser(sourceUsername, sinkUsername);
  }

  @Mutation(() => Boolean)
  async unfollowUser(
    @Args('sourceUsername') sourceUsername: string,
    @Args('sinkUsername') sinkUsername: string,
  ) {
    return this.userService.unfollowUser(sourceUsername, sinkUsername);
  }
}
