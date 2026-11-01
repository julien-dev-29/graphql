import { createApp } from "./src/app.js";

const port = process.env.PORT || 4000;

createApp().listen(port);

console.log(`Running a GraphQL API server at http://localhost:${port}/graphql`);
console.log(`GraphQL IDE at http://localhost:${port}/playground`);