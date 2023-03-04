import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLBigInt } from 'graphql-scalars';

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
}
