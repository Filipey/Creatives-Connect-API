import { Field, InputType } from '@nestjs/graphql';
import { GraphQLBigInt } from 'graphql-scalars';
import { User } from './user-model';

@InputType()
export class CreateUserInput implements Partial<User> {
  @Field()
  username: string;

  @Field()
  password: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  biography?: string;

  @Field({ nullable: true })
  picture?: string;

  @Field()
  city: string;

  @Field(() => GraphQLBigInt)
  birthday: number;
}
