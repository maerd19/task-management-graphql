import Task from "../models/Task";
import User from "../models/User";

export const resolvers = {
  Query: {
    tasks: async () => await Task.find(),
    task: async (_: any, { id }: { id: string }) => await Task.findById(id),
    users: async () => await User.find(),
    user: async (_: any, { id }: { id: string }) => await User.findById(id),
  },
  Mutation: {
    createTask: async (_: any, { input }: { input: any }) => {
      const task = new Task(input);
      await task.save();
      return task;
    },
    updateTask: async (_: any, { id, input }: { id: string; input: any }) => {
      const task = await Task.findByIdAndUpdate(id, input, { new: true });
      return task;
    },
    deleteTask: async (_: any, { id }: { id: string }) => {
      await Task.findByIdAndDelete(id);
      return true;
    },
    createUser: async (_: any, { input }: { input: any }) => {
      const user = new User(input);
      await user.save();
      return user;
    },
  },
  Task: {
    assignedTo: async (parent: any) => {
      if (parent.assignedTo) {
        return await User.findById(parent.assignedTo);
      }
      return null;
    },
  },
  User: {
    tasks: async (parent: any) => await Task.find({ assignedTo: parent.id }),
  },
};
