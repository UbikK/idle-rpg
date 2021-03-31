import { AppBar, Toolbar, Typography, Button, makeStyles } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useAuth } from "../services/AuthService";
const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    link: {
        textDecoration: 'none',
        color: 'white'
    }
  }));
export default function Navigation(){
    const classes = useStyles();
    const history = useHistory();
    const auth = useAuth();
    return (
    <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" className={classes.title}>
          <Link to="/" className={classes.link}>Mon petit RPG</Link>
      </Typography>
      {
        auth?.token?
            <Button color="inherit" onClick={() => auth.signout(() => history.push("/"))}>Me deconnecter</Button>
            : 
            <Button color="inherit"><Link to="/character-select" className={classes.link}>Me connecter</Link></Button>}
    </Toolbar>
  </AppBar>
  )
}