import { compare } from "bcrypt";
import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import User from "../database/entities/User";
import logger from "../logger";
import { getLoginToken } from "../utils";

export const LoginInputType = new GraphQLInputObjectType({
  name: "LoginInput",
  fields: {
    username: { type: new GraphQLNonNull(GraphQLString) },
    pwd: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export async function login(input: { username: string; pwd: string }) {
  try {
    const user: User = await User.getByUsername(input.username);

    if (user) {
      const checkPwd = await compare(input.pwd, user.password as string);

      if (checkPwd) {
        const token = getLoginToken(user);
        return token;
      }
    }
  } catch (e) {
    logger.error(e);
    throw e;
  }
}
