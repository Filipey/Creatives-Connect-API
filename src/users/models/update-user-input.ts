import { Field, InputType } from '@nestjs/graphql';
import { GraphQLBigInt } from 'graphql-scalars';
import { User } from './user-model';

@InputType()
export class UpdateUserInput implements Partial<User> {
  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  biography?: string;

  @Field({ nullable: true })
  picture?: string;

  @Field({ nullable: true })
  city?: string;

  @Field(() => GraphQLBigInt, { nullable: true })
  birthday?: number;
}
