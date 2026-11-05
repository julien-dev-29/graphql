import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolver.js";

const PORT = 4000;
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: PORT },
});

// app.all(
//   "/graphql",
//   createHandler({
//     schema: typeDefs,
//     rootValue: resolvers,
//   }),
// );
// app.get("/", (_req, res) => {
//   res.type("html");
//   res.end(ruruHTML({ endpoint: "/graphql" }));
// });


console.log(`Server listen at port ${PORT}`);
