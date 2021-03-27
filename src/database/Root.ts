import { createUser, getUser } from "../services/UserService";

const root = {
    getUser: ({ id } : {id: string}) => {
      return getUser(id);
    },
    createTodo: ({ username, pwd }: {username: string, pwd: string}) => {
      return createUser({
          username: username, 
          pwd: pwd
        })
    }
  };

export default root;