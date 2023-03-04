import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CommentInput {
  @Field()
  text: string;
}
