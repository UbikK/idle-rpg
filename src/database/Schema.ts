import { buildSchema, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import User, {UserInputType, UserType} from './entities/User';

const schema: GraphQLSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            user: {
                type: UserType,
                args: {
                    id: {type: GraphQLString}
                },
                resolve: (_, {id}) => User.getById(id)
            }
        }
    }),
    mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            createUser: {
                type: UserType,
                args: {
                    user: {
                      type: new GraphQLNonNull(UserInputType),
                    },
                  },
                resolve: (_, {user:{username, pwd}}) => {
                    return User.createUser({username, pwd})
                }
            }
        }
    })
})

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