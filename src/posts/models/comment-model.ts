import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLBigInt } from 'graphql-scalars';
import { User } from 'src/users/models/user-model';

@ObjectType()
export class Comment {
  @Field()
  text: string;

  @Field(() => GraphQLBigInt)
  createdAt: number;

  @Field(() => User)
  owner: User;
}
