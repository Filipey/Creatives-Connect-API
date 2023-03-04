import { Injectable } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommentInput } from './models/comment-input';
import { Comment } from './models/comment-model';
import { CreatePostInput } from './models/create-post-input';
import { PostComment } from './models/post-comment-mode';
import { Post } from './models/post-model';
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

  @Mutation(() => Boolean)
  async likePost(
    @Args('username') username: string,
    @Args('postId') postId: string,
  ) {
    return this.postService.likePost(username, postId);
  }

  @Mutation(() => Boolean)
  async unlikePost(
    @Args('username') username: string,
    @Args('postId') postId: string,
  ) {
    return this.postService.unlikePost(username, postId);
  }

  @Mutation(() => Comment)
  async comment(
    @Args('username') username: string,
    @Args('postId') postId: string,
    @Args('commentInput') commentInput: CommentInput,
  ) {
    return this.postService.comment(username, postId, commentInput);
  }

  @Mutation(() => Boolean)
  async deleteComment(
    @Args('username') username: string,
    @Args('postId') postId: string,
    @Args('commentId') commentId: string,
  ) {
    return this.postService.deleteComment(username, postId, commentId);
  }

  @Mutation(() => Post)
  async createPost(
    @Args('username') username: string,
    @Args('postInput') postInput: CreatePostInput,
  ) {
    return this.postService.createPost(username, postInput);
  }

  @Mutation(() => Post)
  async updatePost(
    @Args('postId') postId: string,
    @Args('updatePost') updatePost: CreatePostInput,
  ) {
    return this.postService.updatePost(postId, updatePost);
  }

  @Mutation(() => Boolean)
  async deletePost(@Args('postId') postId: string) {
    return this.postService.deletePost(postId);
  }
}
