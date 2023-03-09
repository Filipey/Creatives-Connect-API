import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { GraphQLBigInt } from 'graphql-scalars';

@ObjectType()
export class User {
  @Field()
  name: string;

  @HideField()
  @Field()
  password: string;

  @Field()
  username: string;

  @Field({ nullable: true })
  biography: string;

  @Field({ nullable: true })
  picture: string;

  @Field()
  city: string;

  @Field(() => GraphQLBigInt)
  birthday: number;

  @Field(() => GraphQLBigInt)
  createdAt: number;
}
