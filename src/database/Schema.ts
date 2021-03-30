import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { LoginInputType, login } from "../services/LoginService";
import Character, { CharacterType, CharInputType, selectOpponent } from "./entities/Character";
import User, {UserInputType, UserType} from './entities/User';
export const schema: GraphQLSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            user: {
                type: UserType,
                args: {
                    id: {type: GraphQLString}
                },
                resolve: async (_, {id}) => await User.getById(id)
            },
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
            },
            opponent: {
                type: CharacterType,
                args: {
                    charId: {type: GraphQLString}
                },
                resolve: async (_, {charId})=> await selectOpponent(charId)
            }
        }
    }),
    mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            signup: {
                type: UserType,
                args: {
                    user: {
                      type: new GraphQLNonNull(UserInputType),
                    },
                  },
                resolve: async (_, {user:{username, pwd, firstname, lastname}}) => {
                    return await User.createUser({username, pwd, firstname, lastname})
                }
            },
            login: {
                type: GraphQLString,
                args: {
                    user: {
                      type: new GraphQLNonNull(LoginInputType),
                    },
                  },
                resolve: async (_, {user:{username, pwd}}) => {
                    return await login({username, pwd})
                }
            },
            editCharacter: {
                type: CharacterType,
                args: {
                    character: {type: new GraphQLNonNull(CharInputType)}
                },
                resolve: async (_, {character}) => await Character.createOrEditChar(character)
            }
        }
    })
})
/* export const userSchema: GraphQLSchema = new GraphQLSchema({
    
});

export const loginSchema: GraphQLSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            token: {
                type: GraphQLString,
            }
        }
    }),
    mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            
        }
    })
}) */

export const characterSchema: GraphQLSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            
        }
    }),
    mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            
            
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
