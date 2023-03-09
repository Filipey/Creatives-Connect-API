import { Injectable } from '@nestjs/common';
import { parseDbInt } from 'src/utils/DbParser';
import { CommentInput } from './models/comment-input';
import { CreatePostInput } from './models/create-post-input';
import { PostsRepository } from './repositories/posts.repository';

@Injectable()
export class PostsService {
  constructor(private readonly repository: PostsRepository) {}

  async findPostById(id: string) {
    const res = await this.repository.findPostById(id);

    const post = res[0].get(0).properties;
    const parsedCreatedAt = parseDbInt(post.created_at);
    const parsedDbLikes = parseDbInt(post.likes);

    const parsedPost = {
      ...post,
      createdAt: parsedCreatedAt,
      likes: parsedDbLikes,
    };

    return parsedPost;
  }

  async findUserPosts(username: string) {
    const result = await this.repository.findUserPosts(username);

    const nodes = result.map((post) => post.toObject());

    const posts = nodes.map((node) => node.p.properties);

    const parsedPosts = posts.map((post) => ({
      ...post,
      createdAt: parseDbInt(post.created_at),
      likes: parseDbInt(post.likes),
    }));

    return parsedPosts;
  }

  async likePost(username: string, postId: string) {
    return this.repository.likePost(username, postId);
  }

  async unlikePost(username: string, postId: string) {
    return this.repository.unlikePost(username, postId);
  }

  async comment(username: string, postId: string, comment: CommentInput) {
    const result = await this.repository.comment(username, postId, comment);

    if (result === false) return result;

    return result[0].get(0).properties;
  }

  async deleteComment(username: string, postId: string, commentId: string) {
    return this.repository.deleteComment(username, postId, commentId);
  }

  async findPostComments(postId: string) {
    const result = await this.repository.findPostComments(postId);

    const comments = result.map((node) => {
      const comment = node.get('c').properties;
      const user = node.get('u').properties;

      return {
        ...comment,
        createdAt: parseDbInt(comment.created_at),
        owner: {
          ...user,
          birthday: parseDbInt(user.birthday),
          createdAt: parseDbInt(user.created_at),
        },
      };
    });

    return comments;
  }

  async getUserTimeline(username: string) {
    const result = await this.repository.getUserTimeline(username);
    const timeline = result.map((node) => {
      const post = node.get('p').properties;
      const postMetadata = node.get('pt').properties;
      const postOwner = node.get('f').properties;

      return {
        ...post,
        createdAt: parseDbInt(post.created_at),
        likes: parseDbInt(post.likes),
        timestamp: parseDbInt(postMetadata.timestamp),
        owner: {
          ...postOwner,
          createdAt: parseDbInt(postOwner.created_at),
          birthday: parseDbInt(postOwner.birthday),
        },
      };
    });

    return timeline;
  }

  async createPost(username: string, post: CreatePostInput) {
    const createdPost = await this.repository.create(username, post);
    const postNode = createdPost[0].get(0).properties;

    return {
      ...postNode,
      likes: parseDbInt(postNode.likes),
      createdAt: parseDbInt(postNode.created_at),
    };
  }

  async updatePost(postId: string, updatePost: CreatePostInput) {
    const updatedPost = await this.repository.update(postId, updatePost);
    const updatedPostNode = updatedPost[0].get(0).properties;

    return {
      ...updatedPostNode,
      likes: parseDbInt(updatedPostNode.likes),
      createdAt: parseDbInt(updatedPostNode.created_at),
    };
  }

  async deletePost(postId: string) {
    return this.repository.delete(postId);
  }
}
