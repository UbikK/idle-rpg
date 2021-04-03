import { useMutation } from '@apollo/client';
import { Container, CssBaseline, makeStyles, Typography, Grid, TextField, Button } from '@material-ui/core';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { ChangeEvent } from 'react';
import { useHistory } from 'react-router-dom';
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

const signupMutation = gql`
    mutation signup($user: UserInput!) {
        signup(user: $user){
            token
        }
    }
`

export default function SignUp(){
    const classes = useStyles();
    const [username, setUsername] = useState<string>();
    const [pwd, setPwd] = useState<string>();
    const [firstname, setFirstname] = useState<string>();
    const [lastname, setLastname] = useState<string>();
    const [signup] = useMutation(signupMutation);
    const auth = useAuth();

    let history = useHistory();
    let pwdConfirm = true;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => { 
        switch (event.target.name) {
            case 'username':
                setUsername(event.target.value);
                break;
             
            case 'pwd': 
                setPwd(event.target.value);
                break;
            
            case 'lastname': 
                setLastname(event.target.value);
                break;

            case 'firstname': 
                setFirstname(event.target.value);
                break;
            
            case 'pwd-confirm':
                pwdConfirm = (event.target.value && event.target.value === pwd) as boolean;
                break;
        }
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const user = {
            username: username,
            pwd: pwd,
            firstname: firstname,
            lastname: lastname
        };
        const userData = await signup({variables: {user: user}});
        console.log(userData)
        auth?.signin(userData.data.token);
        history.push("/character-select");
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">Créez votre compte</Typography>
                <form className={classes.form} onSubmit={handleSubmit} autoComplete="off">
                    <Grid container direction="column">
                        <TextField
                            variant="outlined"
                            type="text"
                            label="Nom"
                            id="lastname"
                            name="lastname"
                            margin="normal"
                            required
                            fullWidth
                            onChange={handleChange}
                        ></TextField>
                        <TextField
                            variant="outlined"
                            type="text"
                            label="Prénom"
                            id="firstname"
                            name="firstname"
                            margin="normal"
                            required
                            fullWidth
                            onChange={handleChange}
                        ></TextField>
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
                        />
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
                        <TextField
                            variant="outlined"
                            type="password"
                            label="Confirmer le Mot de Passe"
                            id="pwd-confirm"
                            name="pwd-confirm"
                            margin="normal"
                            required
                            fullWidth
                            onChange={handleChange}
                            error={!pwdConfirm}
                        ></TextField>
                        <Button
                            variant="contained" 
                            type="submit"
                            color="primary"
                            className={classes.submit}
                        >Connexion
                        </Button>
                    </Grid>
                </form>
            </div>
        </Container>
    )
}