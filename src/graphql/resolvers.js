import { queuePositions, QUEUE_UPDATED } from ".";
import { withFilter } from "graphql-subscriptions";
import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis from "ioredis";

const options = {
  host: "127.0.0.1",
  port: "6379",
  db: 0,
  retryStrategy: (times) => {
    // reconnect after
    return Math.min(times * 50, 2000);
  },
};
const pubsub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options),
});

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
    quitQueue: (_, data) => {
      const queueItem = queuePositions.find(
        (queue) => queue.queueId === data.queueId
      );
      queueItem.status = "ABANDONED";
      return queueItem;
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
