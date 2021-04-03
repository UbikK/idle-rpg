import { GraphQLObjectType, GraphQLString, GraphQLInputObjectType, GraphQLNonNull, GraphQLInt, GraphQLList } from "graphql";

export const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: {type: GraphQLString},
        username: {type: GraphQLString},
        token: {type: GraphQLString}
    }
})

export const UserInputType = new GraphQLInputObjectType({
    name: 'UserInput',
    fields: {
      username: { type: new GraphQLNonNull(GraphQLString) },
      pwd: { type: new GraphQLNonNull(GraphQLString) },
      firstname: { type: new GraphQLNonNull(GraphQLString) },
      lastname: { type: new GraphQLNonNull(GraphQLString) },
    }
  });

  export const LoginInputType = new GraphQLInputObjectType({
    name: "LoginInput",
    fields: {
      username: { type: new GraphQLNonNull(GraphQLString) },
      pwd: { type: new GraphQLNonNull(GraphQLString) },
    },
  });

export const CharInputType = new GraphQLInputObjectType({
    name: 'CharacterInput',
    fields: {
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        health: {type: GraphQLInt},
        attack: {type: GraphQLInt},
        defense: {type: GraphQLInt},
        magik: {type: GraphQLInt},
        rank: {type: GraphQLInt},
        skillpoints: {type: GraphQLInt},
        userId: { type: GraphQLString}
    }
  });
  export const CharacterType = new GraphQLObjectType({
    name: 'Character',
    fields: {
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        skillpoints: {type: GraphQLInt},
        rank: {type: GraphQLInt},
        health: {type: GraphQLInt},
        attack:{type: GraphQLInt},
        defense: {type: GraphQLInt},
        magik: {type: GraphQLInt},
        userId: {type: GraphQLString},
        lastFight: {type: GraphQLString}
    }
})
  export const FightType = new GraphQLObjectType({
    name: 'Fight',
    fields: {
        id: {type: GraphQLString},
        player: {type: CharacterType},
        enemy: {type: CharacterType},
        winner: {type: CharacterType},
        looser: {type: CharacterType},
        date: {type: GraphQLString}
    }
})



export const FightsForCharacterType = new GraphQLObjectType({
    name: 'FightsForCharacter',
    fields: {
        fights: {type: GraphQLList(FightType)}
    }
})

  export const FightSettingType = new GraphQLObjectType({
    name: 'FightSetting',
    fields: {
        player: {type: CharacterType},
        opponent: {type: CharacterType}
    }
})

