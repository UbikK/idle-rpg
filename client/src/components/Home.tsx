import { Button, Container, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';



const useStyles = makeStyles((theme) => ({
    home: {
      height: '100%'
    },
    innerHome: {
      margin: 'auto',
    },
    displayGrid: {
      margin: theme.spacing(3, 0, 2),
      alignItems: 'center',
      justifyContent: 'center'
    },
    startCombat:{
      color: 'white',
      textDecoration: 'none',
    }
  }));

export default function Home(){
    const classes= useStyles();
    
    return(
            <Container className="master">
              <Grid container className={classes.home}>
                <Grid container item direction="column" alignItems="center" className={classes.innerHome}>
                  <Grid container item direction="column" xs={4} className={classes.displayGrid} spacing={3}>
                    <Typography variant="h5">Bienvenue dans Mon Petit RPG!</Typography>
                    
                    <Button variant="contained" color="primary">
                      <Link to="/character-select" className={classes.startCombat}>
                        Commencer le combat!
                      </Link>
                    </Button>
                  </Grid>
                  
                </Grid>
              </Grid>
              
                
            </Container>
        )
    

    
}