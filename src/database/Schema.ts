import { buildSchema, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import {UserType} from './User';
import {createUser} from '../services/UserService';

/* const schema: GraphQLSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            user: {
                type: UserType,
                args: {
                    id: {type: GraphQLString}
                }
            }
        }
    }),
    mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            createUser: {
                type: UserType,
                resolve: (_, {username, pwd}) => {
                    return createUser({username, pwd})
                }
            }
        }
    })
}) */

const schema: GraphQLSchema = buildSchema(`
    type User {
        id: ID
        username: String!
        pwd: String!
    }

    

    type Query {
        getUser(id: ID!): User
    }  
    
    type Mutation {
        createUser(input: User): User
    }
`)
export default schema;

/* type Character {
    id: ID
    name: String
    skillpoints: Int
    health: Int!
    attack: Int!
    defense: Int!
    magik: Int!
    user: User!
} */