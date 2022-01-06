import { queuePositions, QUEUE_UPDATED } from ".";
import { PubSub, withFilter } from "graphql-subscriptions";

// https://www.apollographql.com/docs/apollo-server/data/subscriptions/#the-pubsub-class
// não recomedado em prod
// sugestão https://github.com/davidyaha/graphql-redis-subscriptions
const pubsub = new PubSub();
export const resolvers = {
  Query: {
    getAllQueuePositions: () => {
      console.log("queuePositions", queuePositions);
      return queuePositions;
    },
  },
  Mutation: {
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
