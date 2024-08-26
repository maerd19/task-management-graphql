import { gql } from "apollo-server-express";

export const typeDefs = gql`
  """
  Task type with assignedTo field
  """
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

  """
  User type with tasks field
  """
  type User {
    id: ID!
    name: String!
    email: String!
    tasks: [Task!]!
  }

  type Query {
    """
    Query to get all tasks
    """
    tasks: [Task!]!

    """
    Query to get a task by ID
    """
    task(id: ID!): Task

    """
    Query to get all users
    """
    users: [User!]!

    """
    Query to get a user by ID
    """
    user(id: ID!): User
  }

  type Mutation {
    """
    Mutation to create a task
    """
    createTask(input: CreateTaskInput!): Task!

    """
    Mutation to update a task
    """
    updateTask(id: ID!, input: UpdateTaskInput!): Task!

    """
    Mutation to delete a task
    """
    deleteTask(id: ID!): Boolean!

    """
    Mutation to create a user
    """
    createUser(input: CreateUserInput!): User!
  }

  """
  Input type for task creation
  """
  input CreateTaskInput {
    title: String!
    description: String
    status: TaskStatus = TODO
    assignedToId: ID
  }

  """
  Input type for task updates
  """
  input UpdateTaskInput {
    title: String
    description: String
    status: TaskStatus
    assignedToId: ID
  }

  """
  Input type for user creation
  """
  input CreateUserInput {
    name: String!
    email: String!
  }

  """
  Subscription to listen for task updates
  """
  type Subscription {
    taskUpdated: Task!
  }
`;
