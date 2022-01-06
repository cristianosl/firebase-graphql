import { gql } from "apollo-server";

export const typeDefs = gql`
  type User {
    _id: ID!
    name: String!
    email: String!
    active: Boolean!
  }

  type Post {
    _id: ID!
    title: String!
    content: String!
    author: User!
  }

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
    hello: String
    users: [User]!
    getUserByEmail(email: String!): User!
    getAllQueuePositions: [QueuePosition!]
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
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
    userAdded: User!
    getQueueByPatientId(patientId: String!): QueuePosition
  }
`;
