import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import SignUp from './components/Signup';
import { Container } from '@material-ui/core';
import  { authContext, useAuth, useProvideAuth } from './services/AuthService';
import SignIn from './components/Signin';
import CharacterSelect from './components/CharacterSelect';
import Navigation from './components/Navigation';
import Arena from './components/Arena';
import { useUrlQuery } from './services/Utils';
import Router from './components/Router';





function App() {
  const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    uri: /* 'https://idle-rpg-tribe.herokuapp.com/graphql', */'graphql',
    cache: new InMemoryCache()
  });
  
  return (
    <Container className="master">
      <ApolloProvider client={client}>
      
      <ProvideAuth>
        <BrowserRouter>
          <Navigation/>
            <Switch>
              <Router/>
              
            </Switch>
        </BrowserRouter>
      </ProvideAuth>
        
        
      </ApolloProvider>
    </Container>
  );
}

function ProvideAuth({ children }:any) {
  const auth = useProvideAuth();
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
}



export default App;
