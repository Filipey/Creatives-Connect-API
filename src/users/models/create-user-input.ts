import { Field, InputType, Int } from '@nestjs/graphql';
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

  @Field(() => Int)
  birthday: number;
}
