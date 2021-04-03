import { GraphQLBoolean, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLScalarType, GraphQLSchema, GraphQLString } from "graphql";
import Character, { selectOpponent } from "./entities/Character";
import Fight from "./entities/Fight";
import User, { login } from './entities/User';
import { LoginInputType, UserType, CharacterType, FightSettingType, FightType, UserInputType, CharInputType } from "./Types";
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
                    id: {type: GraphQLString},
                    withFights: {type: GraphQLBoolean}
                },
                resolve: async (_, {id}) => await Character.getCharacterById(id)
            },
            fightSetting: {
                type: FightSettingType,
                args: {
                    charId: {type: GraphQLString}
                },
                resolve: async (_, {charId})=> await selectOpponent(charId)
            },
            fight: {
                type: FightType,
                args: {
                    fightId: {type: GraphQLString}
                },
                resolve: async (_, {fightId}) => await Fight.getFightById(fightId)
            },
            fightsForCharacter: {
                type: GraphQLList(FightType),
                args: {
                    charId: {type: GraphQLString}
                },
                resolve: async (_, {charId}) => await Fight.getFightsForPlayer(charId)
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

