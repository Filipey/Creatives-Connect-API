import { HttpException, HttpStatus } from '@nestjs/common';

export class PostNotFound extends HttpException {
  constructor(id: string) {
    super(`Post with id: '${id}' not found.`, HttpStatus.NOT_FOUND);
  }
}
