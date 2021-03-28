import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLScalarType, GraphQLSchema, GraphQLSchemaConfig, GraphQLString } from "graphql";
import Character, { CharacterType, CharInputType } from "./entities/Character";
import User, {UserInputType, UserType} from './entities/User';

export const userSchema: GraphQLSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            user: {
                type: UserType,
                args: {
                    id: {type: GraphQLString}
                },
                resolve: async (_, {id}) => await User.getById(id)
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
                resolve: async (_, {user:{username, pwd}}) => {
                    return await User.createUser({username, pwd})
                }
            }
        }
    })
});

export const characterSchema: GraphQLSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            characters: {
                type: GraphQLList(CharacterType),
                args: {
                    userId: {type: GraphQLString}
                },
                resolve: async (_, {userId}) => await User.getCharacterList(userId)
            },
            character:{
                type: CharacterType,
                args: {
                    id: {type: GraphQLString}
                },
                resolve: async (_, {id}) => await Character.getCharacterById(id)
            },
            enemies: {
                type: CharacterType,
                resolve: async (_)=> await Character.getEnemies()
            }
        }
    }),
    mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            createPlayerChar: {
                type: CharacterType,
                args: {
                    name: {type: GraphQLString},
                    health: {type: GraphQLInt},
                    defense: {type: GraphQLInt},
                    magik: {type: GraphQLInt},
                    userId: { type: GraphQLString}
                },
                resolve: async (_, {input}) => await Character.createChar(input)
            }
            
            /* ,
            createEnemies: {
                type: CharacterType,
                args:{
                    list: {type: GraphQLList(CharInputType)}
                },
                resolve: async (_, {input}) => Character.createEnemies(input)
            } */
        }
    })
});

export const roundReportSchema: GraphQLSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields:{
            
        }
    }),
    mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            /* executeRound:{

            } */
        }
    })

})
