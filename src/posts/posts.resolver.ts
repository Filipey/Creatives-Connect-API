import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { CommentInput } from './models/comment-input';
import { Comment } from './models/comment-model';
import { CreatePostInput } from './models/create-post-input';
import { PostComment } from './models/post-comment-mode';
import { Post } from './models/post-model';
import { PostTimeline } from './models/posts-timeline';
import { PostsService } from './posts.service';

@Injectable()
@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postService: PostsService) {}

  @Query(() => Post)
  async findPostById(@Args('id') id: string) {
    return this.postService.findPostById(id);
  }

  @Query(() => [Post])
  async findUserPosts(@Args('username') username: string) {
    return this.postService.findUserPosts(username);
  }

  @Query(() => [PostComment])
  async findPostComments(@Args('postId') postId: string) {
    return this.postService.findPostComments(postId);
  }

  @Query(() => Boolean)
  async userLikedPost(
    @Args('username') username: string,
    @Args('postId') postId: string,
  ) {
    return this.postService.userLikedPost(username, postId);
  }

  @Query(() => [PostTimeline])
  @UseGuards(JwtAuthGuard)
  async getUserTimeline(@Args('username') username: string) {
    return this.postService.getUserTimeline(username);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async likePost(
    @Args('username') username: string,
    @Args('postId') postId: string,
  ) {
    return this.postService.likePost(username, postId);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async unlikePost(
    @Args('username') username: string,
    @Args('postId') postId: string,
  ) {
    return this.postService.unlikePost(username, postId);
  }

  @Mutation(() => Comment)
  @UseGuards(JwtAuthGuard)
  async comment(
    @Args('username') username: string,
    @Args('postId') postId: string,
    @Args('commentInput') commentInput: CommentInput,
  ) {
    return this.postService.comment(username, postId, commentInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteComment(
    @Args('username') username: string,
    @Args('postId') postId: string,
    @Args('commentId') commentId: string,
  ) {
    return this.postService.deleteComment(username, postId, commentId);
  }

  @Mutation(() => Post)
  @UseGuards(JwtAuthGuard)
  async createPost(
    @Args('username') username: string,
    @Args('postInput') postInput: CreatePostInput,
  ) {
    return this.postService.createPost(username, postInput);
  }

  @Mutation(() => Post)
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @Args('postId') postId: string,
    @Args('updatePost') updatePost: CreatePostInput,
  ) {
    return this.postService.updatePost(postId, updatePost);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deletePost(@Args('postId') postId: string) {
    return this.postService.deletePost(postId);
  }
}
