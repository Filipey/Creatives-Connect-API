import { HttpStatus } from '@nestjs/common';
import { BaseError } from './BaseError';

export class UserAlreadyFollow extends BaseError {
  constructor(sourceUsername: string, sinkUsername: string) {
    super(
      `The user '${sourceUsername}' already follows '${sinkUsername}'`,
      HttpStatus.CONFLICT,
    );
  }
}
