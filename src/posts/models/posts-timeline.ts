import { Field, Float, ObjectType } from '@nestjs/graphql';
import { GraphQLBigInt } from 'graphql-scalars';

@ObjectType()
export class PostTimeline {
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
}
