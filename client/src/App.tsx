import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import './App.css';
import { Container } from '@material-ui/core';
import  { authContext, useProvideAuth } from './services/AuthService';
import Navigation from './components/Navigation';
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
