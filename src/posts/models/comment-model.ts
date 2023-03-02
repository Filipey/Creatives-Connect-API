import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/models/user-model';

@ObjectType()
export class Comment {
  @Field()
  text: string;

  @Field(() => Int)
  createdAt: number;

  @Field(() => User)
  owner: User;
}
