import { OmitType } from '@nestjs/graphql';
import { User } from './user-model';

export class CreateUserDTO extends OmitType(User, [
  'likes',
  'createdAt',
  'followers',
  'following',
]) {}
