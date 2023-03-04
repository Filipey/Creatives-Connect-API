import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyLikePost extends HttpException {
  constructor(username: string, postId: string) {
    super(
      `The user '${username}' already like the post '${postId}'`,
      HttpStatus.NOT_FOUND,
    );
  }
}
