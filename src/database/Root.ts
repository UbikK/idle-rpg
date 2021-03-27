import logger from "../logger";
import User from "./entities/User";

const root = {
    getUser: ({ id } : {id: string}) => {
      logger.info(id)
      return User.getById(id);
    },
    createUser: ({ username, pwd }: {username: string, pwd: string}) => {
      return User.createUser({
          username: username, 
          pwd: pwd
        })
    }
  };

export default root;