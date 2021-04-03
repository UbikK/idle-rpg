import { gql, useMutation } from '@apollo/client';
import { Button, Container, CssBaseline, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import React, { ChangeEvent, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../services/AuthService';

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));

const loginMutation = gql`
    mutation login($user: LoginInput!) {
        login(user: $user)
    }
    
`
export default function SignIn(/* props: {setToken: Function} */){
    const classes = useStyles();
    const [username, setUsername] = useState<string>();
    const [pwd, setPwd] = useState<string>();
    const [login, {error}] = useMutation(loginMutation);
    let history = useHistory();
    let location = useLocation();
    const auth = useAuth();

    let { from }: any = location.state as any || { from: { pathname: "/" } };
    console.log(from)
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => { 
           switch (event.target.name) {
               case 'username':
                    setUsername(event.target.value);
                    break;
                
                case 'pwd': 
                    setPwd(event.target.value);
           }
     }

    const handleSubmit = async (event: any) => {
      event.preventDefault();
      try{
      const loginData = await login({variables: {user: {username: username, pwd: pwd}}});
      console.log(loginData.data.login);
        auth?.signin(loginData.data.login, () => {
            history.replace(from);
          });
      } catch(e) {
          console.error(e)
      }
      
    }
 
    return(
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Connexion
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container direction="column">
                        <TextField 
                            variant="outlined"
                            type="email"
                            name="username"
                            id="username"
                            label="Adresse email"
                            margin="normal"
                            required
                            fullWidth
                            onChange={handleChange}
                        >
                        </TextField>
                        <TextField
                            variant="outlined"
                            type="password"
                            label="Mot de Passe"
                            id="pwd"
                            name="pwd"
                            margin="normal"
                            required
                            fullWidth
                            onChange={handleChange}
                        ></TextField>
                        <Button
                            variant="contained" 
                            type="submit"
                            color="primary"
                            className={classes.submit}
                        >Connexion
                        </Button>
                        {error? <Typography variant="subtitle1" style={{color:'red'}}>{error.message}</Typography>: undefined}
                    </Grid>
                    
                </form>
                <Typography variant="subtitle1">
                    Pas encore de compte? <Link to="/signup">Créez en un ici!</Link>
                </Typography>
            </div>
            
        </Container>
    )
}