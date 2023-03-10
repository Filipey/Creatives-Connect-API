import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { CreateUserInput } from './models/create-user-input';
import { UpdateUserInput } from './models/update-user-input';
import { User } from './models/user-model';
import { UsersService } from './users.service';

@Injectable()
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Query(() => Boolean)
  async isUserFollowing(
    @Args('sourceUsername') sourceUsername: string,
    @Args('sinkUsername') sinkUsername: string,
  ) {
    return this.userService.isUserFollowing(sourceUsername, sinkUsername);
  }

  @Query(() => User)
  async findUserByUsername(@Args('username') username: string) {
    return this.userService.findByUsername(username);
  }

  @Query(() => [User])
  async findAll() {
    return this.userService.findAllUsers();
  }

  @Query(() => [User])
  async findUserFollowers(@Args('username') username: string) {
    return this.userService.findUserFollowers(username);
  }

  @Query(() => [User])
  async findFollowedsByUser(@Args('username') username: string) {
    return this.userService.findFollowedsByUser(username);
  }

  @Mutation(() => User)
  async createUser(@Args('userInput') userInput: CreateUserInput) {
    return this.userService.create(userInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async followUser(
    @Args('sourceUsername') sourceUsername: string,
    @Args('sinkUsername') sinkUsername: string,
  ) {
    return this.userService.followUser(sourceUsername, sinkUsername);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async unfollowUser(
    @Args('sourceUsername') sourceUsername: string,
    @Args('sinkUsername') sinkUsername: string,
  ) {
    return this.userService.unfollowUser(sourceUsername, sinkUsername);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('username') username: string) {
    return this.userService.delete(username);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Args('username') username: string,
    @Args('updatedUser') updatedUser: UpdateUserInput,
  ) {
    return this.userService.update(username, updatedUser);
  }
}
