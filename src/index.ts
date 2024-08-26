import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { ApolloServer } from "apollo-server-express";
import rateLimit from "express-rate-limit";
import { typeDefs } from "./schemas";
import { resolvers } from "./resolvers";
import { connectDatabase } from "./config/database";
import { authMiddleware } from "./utils/auth";

async function startServer() {
  await connectDatabase();

  const app = express();

  // Apply rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  });
  app.use(limiter);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const user = authMiddleware(req);
      return { user };
    },
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
