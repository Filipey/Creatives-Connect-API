import { Field, Float, ObjectType } from '@nestjs/graphql';
import { GraphQLBigInt } from 'graphql-scalars';
import { User } from 'src/users/models/user-model';

@ObjectType()
export class PostTimeline {
  @Field()
  id: string;

  @Field()
  text: string;

  @Field({ nullable: true })
  picture?: string;

  @Field(() => GraphQLBigInt)
  createdAt: number;

  @Field(() => Float)
  likes: number;

  @Field(() => GraphQLBigInt)
  timestamp: number;

  @Field(() => User)
  owner: User;
}
