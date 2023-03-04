import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLBigInt } from 'graphql-scalars';
import { Post } from 'src/posts/models/post-model';

@ObjectType()
export class User {
  @Field()
  name: string;

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

  @Field(() => [Post], { nullable: true })
  likes: Post[];

  @Field(() => [User], { nullable: true })
  following: User[];

  @Field(() => [User], { nullable: true })
  followers: User[];

  @Field(() => [Post], { nullable: true })
  posts: Post[];
}
