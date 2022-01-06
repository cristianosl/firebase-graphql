import { queuePositions, users, USER_ADDED, QUEUE_UPDATED } from ".";
import { PubSub, withFilter } from "graphql-subscriptions";

// https://www.apollographql.com/docs/apollo-server/data/subscriptions/#the-pubsub-class
// não recomedado em prod
// sugestão https://github.com/davidyaha/graphql-redis-subscriptions
const pubsub = new PubSub();
export const resolvers = {
  Query: {
    hello: () => "Hello World",
    users: () => users,
    getUserByEmail: (_, args) => {
      return users.find((user) => user.email == args.email);
    },
    getAllQueuePositions: () => {
      console.log("queuePositions", queuePositions);
      return queuePositions;
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
    updateQueuePosition: (_, currentQueuePosition) => {
      const findQueue = queuePositions.find((item, idx) => {
        const foundPatient = item.patientId === currentQueuePosition.patientId;
        if (foundPatient) queuePositions[idx] = currentQueuePosition;
        return foundPatient;
      });
      if (!findQueue) {
        queuePositions.push(currentQueuePosition);
      }
      pubsub.publish(QUEUE_UPDATED, {
        getQueueByPatientId: currentQueuePosition,
      });
      return currentQueuePosition;
    },
  },
  Subscription: {
    userAdded: {
      subscribe: () => pubsub.asyncIterator(USER_ADDED),
    },
    getQueueByPatientId: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(QUEUE_UPDATED),
        ({ getQueueByPatientId }, { patientId }) => {
          return getQueueByPatientId.patientId == patientId;
        }
      ),
    },
  },
};
