import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/models/user-model';
import { Comment } from './comment-model';

@ObjectType()
export class Post {
  @Field()
  text: string;

  @Field({ nullable: true })
  picture?: string;

  @Field(() => Int)
  createdAt: number;

  @Field(() => Int)
  likes: number;

  @Field(() => User)
  owner: User;

  @Field(() => [Comment])
  comments: Comment[];
}
