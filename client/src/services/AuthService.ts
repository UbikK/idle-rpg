import { createContext, useContext, useState } from "react";

export const authContext = createContext<AuthContext | undefined>(undefined);

export function useAuth() {
  return useContext(authContext);
}

const authentication = {
  isAuthenticated: false,
  signin(cb: Function) {
    authentication.isAuthenticated = true;
    cb();
  },
  signout(cb: Function) {
    authentication.isAuthenticated = false;
    cb();
  }
};



export function useProvideAuth() {
  const getToken = () => {
    return sessionStorage.getItem('token');
  };

  const [token, setToken] = useState<string | null>(getToken());

  const signin = (token: string, cb: Function) => {
    console.log(token)
    if(token){
      
      
      return authentication.signin(() => {
        sessionStorage.setItem('token', token as string);
        setToken(token);
        cb();
      });
    }
    
  };

  const signout = (cb: Function) => {
    //sessionStorage.removeItem('token');
    return authentication.signout(() => {
      sessionStorage.removeItem('token')
      setToken(null);
      cb();
    });
  };

  return {
    token,
    signin,
    signout
  };
}

type AuthContext = {
  token: string | null,
    signin: Function,
    signout: Function
}

/* export default function useToken() {
  const getToken = () => {
    return sessionStorage.getItem('token');
    
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (userToken: string) => {
    sessionStorage.setItem('token', userToken);
    setToken(userToken);
  };

  const removeToken = () => {
    sessionStorage.removeItem('token');
    setToken(null)
  }

  return {
    setToken: saveToken,
    removeToken: removeToken,
    getToken: getToken,
    token
  }
}

export interface tokenInterface {
  setToken: any,
    removeToken: any,
    getToken: any,
    token: any
} */