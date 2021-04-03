import { Home } from "@material-ui/icons";
import React from "react";
import { Redirect, Route } from "react-router-dom";
import Arena from "./Arena";
import CharacterSelect from "./CharacterSelect";
import SignIn from "./Signin";
import SignUp from "./Signup";
import { useAuth } from "../services/AuthService";
import { useUrlQuery } from "../services/Utils";

export default function Router() {
    let query = useUrlQuery();

    return (
        <>
            <Route exact path="/"><Home/></Route>
              
              <Route exact path="/signup"><SignUp/></Route>
              <Route exact path="/signin"><SignIn/></Route>

              <PrivateRoute path="/character-select">
                <CharacterSelect/>
              </PrivateRoute>
              <PrivateRoute path="/arena">
                <Arena charId={query.get('charId')}/>
              </PrivateRoute>
        </>
        
    )
}

function PrivateRoute({ children, ...rest }: any) {
    let auth = useAuth();
    console.log(auth)
    return (
      <Route
        {...rest}
        render={({ location }) =>
          auth?.token ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/signin",
                state: { from: location }
              }}
    
            />
          )
        }
      />
    );
    }
    