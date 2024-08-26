import { AuthenticationError, UserInputError } from "apollo-server-express";
import { validateOrReject } from "class-validator";
import Task, { ITask } from "../models/Task";
import User, { IUser } from "../models/User";
import { generateToken, hashPassword, comparePasswords } from "../utils/auth";
import { CreateTaskInput, UpdateTaskInput } from "../validators/taskValidators";

interface Context {
  user?: {
    userId: string;
  };
}

export const resolvers = {
  Query: {
    tasks: async () => await Task.find(),
    task: async (_: unknown, { id }: { id: string }) => await Task.findById(id),
    users: async () => await User.find(),
    user: async (_: unknown, { id }: { id: string }) => await User.findById(id),
    me: async (_: unknown, __: unknown, { user }: Context) => {
      if (!user) throw new AuthenticationError("You must be logged in");
      return await User.findById(user.userId);
    },
  },
  Mutation: {
    createTask: async (
      _: unknown,
      { input }: { input: CreateTaskInput },
      { user }: Context
    ) => {
      if (!user) throw new AuthenticationError("You must be logged in");

      const taskInput = new CreateTaskInput();
      Object.assign(taskInput, input);

      try {
        await validateOrReject(taskInput);
      } catch (errors) {
        throw new UserInputError("Invalid input", { errors });
      }

      const task = new Task({ ...input, assignedTo: user.userId });
      await task.save();
      return task;
    },
    updateTask: async (
      _: unknown,
      { id, input }: { id: string; input: UpdateTaskInput },
      { user }: Context
    ) => {
      if (!user) throw new AuthenticationError("You must be logged in");

      const taskInput = new UpdateTaskInput();
      Object.assign(taskInput, input);

      try {
        await validateOrReject(taskInput);
      } catch (errors) {
        throw new UserInputError("Invalid input", { errors });
      }

      const task = await Task.findOneAndUpdate(
        { _id: id, assignedTo: user.userId },
        input,
        { new: true }
      );

      if (!task)
        throw new Error("Task not found or you're not authorized to update it");
      return task;
    },
    deleteTask: async (
      _: unknown,
      { id }: { id: string },
      { user }: Context
    ) => {
      if (!user) throw new AuthenticationError("You must be logged in");

      const task = await Task.findOneAndDelete({
        _id: id,
        assignedTo: user.userId,
      });
      if (!task)
        throw new Error("Task not found or you're not authorized to delete it");
      return true;
    },
    createUser: async (
      _: unknown,
      { input }: { input: { name: string; email: string; password: string } }
    ) => {
      const { name, email, password } = input;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("User already exists");
      }
      const hashedPassword = await hashPassword(password);
      const user = new User({ name, email, password: hashedPassword });
      await user.save();
      return user;
    },
    signup: async (
      _: unknown,
      { input }: { input: { name: string; email: string; password: string } }
    ) => {
      const { name, email, password } = input;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("User already exists");
      }
      const hashedPassword = await hashPassword(password);
      const user = new User({ name, email, password: hashedPassword });
      await user.save();
      const token = generateToken(user.id);
      return { token, user };
    },
    login: async (
      _: unknown,
      { email, password }: { email: string; password: string }
    ) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Invalid credentials");
      }
      const isValid = await comparePasswords(password, user.password);
      if (!isValid) {
        throw new AuthenticationError("Invalid credentials");
      }
      const token = generateToken(user.id);
      return { token, user };
    },
  },
  Task: {
    assignedTo: async (parent: ITask) => {
      if (parent.assignedTo) {
        return await User.findById(parent.assignedTo);
      }
      return null;
    },
  },
  User: {
    tasks: async (parent: IUser) => await Task.find({ assignedTo: parent.id }),
  },
};
