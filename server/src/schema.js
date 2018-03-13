import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} from 'graphql-tools';

import { resolvers } from './resolvers';

const typeDefs = `
type Channel {
  id: ID!                # "!" denotes a required field
  name: String
  messages: [Message]!
}

input MessageInput{
  channelId: ID!
  text: String
}

input rangeInputs{
  skip: Int
  limit: Int
}

input MailInputs{
  subject: String
  email: String
  body: String
}

type Message {
  id: ID!
  text: String
}

type MailList{
  count: Int
  list:[Mail!]
}

type Mail{
  _id: ID!
  email: String!
  subject: String!
  body: String!
  date: String
}

type User{
  id:ID!
  email: String!
  password: String!
  date: String
}

# This type specifies the entry points into our API
type Query {
  channels: [Channel]    # "[]" means this is a list of channels
  channel(id: ID!): Channel
  getMailList(range: rangeInputs!): MailList
}

# The mutation root type, used to define all mutations
type Mutation {
  addChannel(name: String!): Channel
  addMessage(message: MessageInput!): Message
  sendMail(mail: MailInputs!):Mail
  deleteMail(id:String): Boolean
}

# The subscription root type, specifying what we can subscribe to
type Subscription {
  messageAdded(channelId: ID!): Message
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };
