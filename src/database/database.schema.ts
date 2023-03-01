import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type User {
    name: String!
    password: String!
    username: String!
    biography: String
    picture: String
    city: String!
    birthday: Int!
    created_at: Int!
    follow: [User!]! @relationship(type: "FOLLOW", direction: OUT)
    likes: [Post!]! @relationship(type: "LIKED", direction: OUT)
  }

  type Post {
    text: String!
    image: String
    created_at: Int!
    likes: Int!
    owner: User! @relationship(type: "OWNER", direction: OUT)
    comments: [Comment!]! @relationship(type: "COMMENTS", direction: OUT)
  }

  type Comment {
    text: String!
    created_at: Int!
    owner: User! @relationship(type: "COMMENT_OWNER", direction: IN)
  }
`;
