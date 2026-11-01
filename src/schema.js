import { buildSchema } from "graphql";

export const schema = buildSchema(`
  type Jurol { 
    name: String!
    age:  Int!
  } 

  type Query {
    getJurol(name: String): Jurol
  }
  `);

export class Jurol {
  constructor(name) {
    this.name = name;
    this.age = 44;
  }
}
