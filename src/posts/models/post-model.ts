import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLBigInt } from 'graphql-scalars';
import { User } from 'src/users/models/user-model';

@ObjectType()
export class Post {
  @Field(() => ID)
  id: string;

  @Field()
  text: string;

  @Field({ nullable: true })
  picture?: string;

  @Field(() => GraphQLBigInt)
  createdAt: number;

  @Field(() => Float)
  likes: number;

  @Field(() => User)
  owner: User;
}
