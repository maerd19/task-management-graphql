import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Task {
    id: ID!
    title: String!
    description: String
    status: TaskStatus!
    assignedTo: User
    createdAt: String!
    updatedAt: String!
  }

  enum TaskStatus {
    TODO
    IN_PROGRESS
    DONE
  }

  type User {
    id: ID!
    name: String!
    email: String!
    tasks: [Task!]!
  }

  type Query {
    tasks: [Task!]!
    task(id: ID!): Task
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, input: UpdateTaskInput!): Task!
    deleteTask(id: ID!): Boolean!
    createUser(input: CreateUserInput!): User!
  }

  input CreateTaskInput {
    title: String!
    description: String
    status: TaskStatus = TODO
    assignedToId: ID
  }

  input UpdateTaskInput {
    title: String
    description: String
    status: TaskStatus
    assignedToId: ID
  }

  input CreateUserInput {
    name: String!
    email: String!
  }

  type Subscription {
    taskUpdated: Task!
  }
`;
