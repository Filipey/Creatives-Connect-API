import { HttpStatus } from '@nestjs/common';
import { BaseError } from './BaseError';

export class UserDontFollow extends BaseError {
  constructor(sourceUsername: string, sinkUsername: string) {
    super(
      `The user '${sourceUsername}' dont follow '${sinkUsername}'`,
      HttpStatus.CONFLICT,
    );
  }
}
