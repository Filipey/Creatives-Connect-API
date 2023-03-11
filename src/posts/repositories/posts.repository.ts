import { Injectable } from '@nestjs/common';
import { CommentNotFound } from 'src/common/errors/CommentNotFound';
import { PostNotFound } from 'src/common/errors/PostNotFound';
import { UserAlreadyLikePost } from 'src/common/errors/UserAlreadyLikePost';
import { UserDontLikePost } from 'src/common/errors/UserDontLikePost';
import { UserNotFound } from 'src/common/errors/UserNotFound';
import { Neo4JService } from 'src/database/database.service';
import { v4 as uuidv4 } from 'uuid';
import { CommentInput } from '../models/comment-input';
import { CreatePostInput } from '../models/create-post-input';

@Injectable()
export class PostsRepository {
  constructor(private readonly service: Neo4JService) {}

  private async userAndPostExists(username: string, postId: string) {
    const userExists = await this.service.read(`
    MATCH (u:User {username: '${username}'})
    RETURN u
    `);

    const postExist = await this.service.read(`
    MATCH (p: Post {id: '${postId}'})
    RETURN p
    `);

    if (userExists.length === 0) {
      throw new UserNotFound(username);
    }

    if (postExist.length === 0) {
      throw new PostNotFound(postId);
    }

    return true;
  }

  async findPostById(id: string) {
    const post = await this.service.read(`
    MATCH (u:User)-[:POSTED]->(p: Post {id: '${id}'})
    RETURN p, u
    `);

    if (post.length === 0) {
      throw new PostNotFound(id);
    }

    return post;
  }

  async findUserPosts(username: string) {
    const posts = await this.service.read(`
    MATCH (u:User {username: '${username}'})-[:POSTED]->(p:Post)
    RETURN p, u
    `);

    return posts;
  }

  async likePost(username: string, postId: string) {
    if (await this.userAndPostExists(username, postId)) {
      const userLikedPost = await this.service.read(`
      MATCH (u:User {username: '${username}'})-[l:LIKED]->(p:Post {id: '${postId}'})
      RETURN l
      `);

      if (userLikedPost.length > 0) {
        throw new UserAlreadyLikePost(username, postId);
      }

      await this.service.write(`
      MATCH (u:User {username: '${username}'})
      MATCH (p:Post {id: '${postId}'})
      CREATE (u)-[l:LIKED {timestamp: ${Date.now() - 1000 * 3600 * 3}}]->(p)
      SET p.likes = p.likes + 1
      RETURN type(l)
      `);

      return true;
    }

    return false;
  }

  async unlikePost(username: string, postId: string) {
    if (await this.userAndPostExists(username, postId)) {
      const userLikedPost = await this.service.read(`
      MATCH (u:User {username: '${username}'})-[l:LIKED]->(p:Post {id: '${postId}'})
      RETURN l
      `);

      if (userLikedPost.length === 0) {
        throw new UserDontLikePost(username, postId);
      }

      await this.service.write(`
      MATCH (u:User {username: '${username}'})-[l:LIKED]->(p:Post {id: '${postId}'})
      DELETE l
      SET p.likes = p.likes - 1
      `);

      return true;
    }

    return false;
  }

  async userLikedPost(username: string, postId: string) {
    const userLikedPost = await this.service.read(`
      MATCH (u:User {username: '${username}'})-[l:LIKED]->(p:Post {id: '${postId}'})
      RETURN l
      `);

    if (userLikedPost.length === 0) {
      return false;
    }

    return true;
  }

  async comment(username: string, postId: string, comment: CommentInput) {
    if (await this.userAndPostExists(username, postId)) {
      const commentId = uuidv4();
      const commentResult = await this.service.write(`
      MATCH (u:User {username: '${username}'})
      MATCH (p:Post {id: '${postId}'})
      CREATE (u)-[c:COMMENTED {id: '${commentId}', text: '${
        comment.text
      }', created_at: ${Date.now() - 1000 * 3600 * 3}}]->(p)
      RETURN c, u
      `);

      return commentResult;
    }
    return false;
  }

  async deleteComment(username: string, postId: string, commentId: string) {
    if (await this.userAndPostExists(username, postId)) {
      const userCommentedPost = await this.service.read(`
        MATCH (u:User {username: '${username}'})-[c:COMMENTED {id: '${commentId}'}]->(p:Post {id: '${postId}'})
        RETURN c
      `);

      if (userCommentedPost.length === 0) {
        throw new CommentNotFound(username, postId, commentId);
      }

      await this.service.write(`
      MATCH (u:User {username: '${username}'})-[c:COMMENTED {id: '${commentId}'}]->(p:Post {id: '${postId}'})
      DELETE c
      `);

      return true;
    }

    return false;
  }

  async findPostComments(postId: string) {
    const postExists = await this.service.read(`
    MATCH (p:Post {id: '${postId}'})
    RETURN p
    `);

    if (postExists.length === 0) {
      throw new PostNotFound(postId);
    }

    const postComments = await this.service.read(`
    MATCH (u:User)-[c:COMMENTED]->(p: Post {id: '${postId}'})
    RETURN c, u
    `);

    return postComments;
  }

  async getUserTimeline(username: string) {
    const userExists = await this.service.read(
      `MATCH (u:User {username: '${username}'})
       RETURN u
      `,
    );

    if (userExists.length === 0) {
      throw new UserNotFound(username);
    }

    const result = await this.service.read(
      `MATCH (u:User {username: '${username}'})-[:FOLLOW]->(f:User)-[pt:POSTED]->(p:Post)
       RETURN p, pt, f
      `,
    );

    return result;
  }

  async create(username: string, post: CreatePostInput) {
    const postId = uuidv4();
    await this.service.write(`
    CREATE(p: Post {id: '${postId}', text: '${post.text}', picture: '${
      post.picture
    }', created_at: ${Date.now() - 1000 * 3600 * 3}, likes: 0}) RETURN p
    `);

    const createPost = await this.service.write(`
    MATCH (u:User {username: '${username}'})
    MATCH (p:Post {id: '${postId}'})
    CREATE (u)-[pt:POSTED {timestamp: ${Date.now()}}]->(p)
    RETURN p, u
    `);

    return createPost;
  }

  async update(id: string, updatePost: CreatePostInput) {
    const updateResult = await this.service.write(`
    MATCH (p:Post {id: '${id}'})
    SET p.text = '${updatePost.text}', p.picture = '${updatePost.picture}'
    RETURN p
    `);

    return updateResult;
  }

  async delete(id: string) {
    const postExists = await this.service.write(`
    MATCH (p:Post {id: '${id}'})
    RETURN p
    `);

    if (postExists.length === 0) {
      throw new PostNotFound(id);
    }

    await this.service.write(`
    MATCH (p:Post {id: '${id}'})
    DETACH DELETE p
    `);

    return true;
  }
}
