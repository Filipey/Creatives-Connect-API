import { HttpException, HttpStatus } from '@nestjs/common';

export class UserDontLikePost extends HttpException {
  constructor(username: string, postId: string) {
    super(
      `The user '${username}' dont liked the post '${postId}'`,
      HttpStatus.NOT_FOUND,
    );
  }
}
