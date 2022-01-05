import { users, USER_ADDED } from ".";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();
export const resolvers = {
  Query: {
    hello: () => "Hello World",
    users: () => users,
    getUserByEmail: (_, args) => {
      return users.find((user) => user.email == args.email);
    },
  },
  Mutation: {
    createUser: (_, args) => {
      const newUser = {
        _id: String(Math.random()),
        name: args.name,
        email: args.email,
        active: true,
      };
      users.push(newUser);
      pubsub.publish(USER_ADDED, { userAdded: newUser });
      return newUser;
    },
  },
  Subscription: {
    userAdded: {
      subscribe: () => pubsub.asyncIterator(USER_ADDED),
    },
  },
};
