import { gql } from "apollo-server";

export const typeDefs = gql`
  enum QueueStatus {
    ENQUEUED
    READY
    IN_CALL
    DONE
  }

  type QueuePosition {
    queueId: String!
    patientId: String!
    status: QueueStatus
    position: String!
    updatedAt: String!
    attendanceId: String
  }

  type Query {
    getAllQueuePositions: [QueuePosition!]
  }

  type Mutation {
    updateQueuePosition(
      queueId: String!
      patientId: String!
      status: String!
      position: String!
      updatedAt: String!
      attendanceId: String
    ): QueuePosition!
  }

  type Subscription {
    getQueueByPatientId(patientId: String!): QueuePosition
  }
`;
