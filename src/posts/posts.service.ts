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

    const post = res.map((node) => {
      const postNode = node.get('p').properties;
      const owner = node.get('u').properties;

      return {
        ...postNode,
        createdAt: parseDbInt(post.created_at),
        likes: parseDbInt(post.likes),
        owner: {
          ...owner,
          birthday: parseDbInt(owner.birthday),
          createdAt: parseDbInt(owner.created_at),
        },
      };
    });

    return post;
  }

  async findUserPosts(username: string) {
    const result = await this.repository.findUserPosts(username);

    const posts = result.map((node) => {
      const postNode = node.get('p').properties;
      const owner = node.get('u').properties;

      return {
        ...postNode,
        createdAt: parseDbInt(postNode.created_at),
        likes: parseDbInt(postNode.likes),
        owner: {
          ...owner,
          birthday: parseDbInt(owner.birthday),
          createdAt: parseDbInt(owner.created_at),
        },
      };
    });

    return posts;
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

    const commentProperties = result[0].get('c').properties;
    const ownerProperties = result[0].get('u').properties;

    const resultComment = {
      ...commentProperties,
      createdAt: parseDbInt(commentProperties.created_at),
      owner: {
        ...ownerProperties,
        birthday: parseDbInt(ownerProperties.birthday),
        createdAt: parseDbInt(ownerProperties.created_at),
      },
    };

    return resultComment;
  }

  async deleteComment(username: string, postId: string, commentId: string) {
    return this.repository.deleteComment(username, postId, commentId);
  }

  async userLikedPost(username: string, postId: string) {
    return this.repository.userLikedPost(username, postId);
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

    const postProperties = createdPost[0].get('p').properties;
    const ownerProperties = createdPost[0].get('u').properties;

    const resultPost = {
      ...postProperties,
      createdAt: parseDbInt(postProperties.created_at),
      likes: parseDbInt(postProperties.likes),
      owner: {
        ...ownerProperties,
        createdAt: parseDbInt(ownerProperties.created_at),
        birthday: parseDbInt(ownerProperties.birthday),
      },
    };

    return resultPost;
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
