import express from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./schemas";
import { resolvers } from "./resolvers";
import { connectDatabase } from "./config/database";

async function startServer() {
  await connectDatabase();

  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // TODO: Add context for authentication
  });

  await server.start();
  server.applyMiddleware({ app } as any);

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(
      `Server running on http://localhost:${PORT}${server.graphqlPath}`
    );
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
});
