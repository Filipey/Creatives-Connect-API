import { HttpException, HttpStatus } from '@nestjs/common';

export class CommentNotFound extends HttpException {
  constructor(username: string, postId: string, commentId: string) {
    super(
      `The user '${username}' dont have any comment with id '${commentId}' in the post '${postId}'`,
      HttpStatus.NOT_FOUND,
    );
  }
}
