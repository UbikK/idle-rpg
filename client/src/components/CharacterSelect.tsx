import { gql, useLazyQuery } from '@apollo/client';
import { Button, Grid, makeStyles, Paper } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useJwt } from 'react-jwt';
import Character from '../models/Character.model';
import { useAuth } from '../services/AuthService';
import CharacterEditor from './CharacterEditor';
import CharacterSheet from './CharacterSheet';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';

const useStyles = makeStyles((theme) => ({
    create: {
        color: 'white',
        textDecoration: 'none'
    },
    empty: {
        height: '100%'
    },
    chargrid: {
        padding: '1rem'
    },
    charLabel: {
        padding: '1rem',
        textAlign: 'center',
        '&:hover': {cursor: 'pointer'}
    },
    disabled: {
        padding: '1rem',
        textAlign: 'center',
        backgroundColor: 'lightslategrey',
        '&:hover': {cursor: 'not-allowed'}
    },
}));

const characterListQuery = gql`
    query characters($userId: String){
        characters(userId: $userId) {
            name
            rank
            skillpoints
            attack
            health
            defense
            magik
            id
            lastFight
        }
    }
`

export default function CharacterSelect(props: any){
    const classes = useStyles();
    const [charList, setCharList] = useState<Character[]>();
    const [character, setCharacter] = useState<Character>();
    const [userId, setUserId] = useState<string>();
    const [refresh, setRefresh] = useState(false);
    const [openEditor, setOpenEditor] = useState(false);
    let auth = useAuth();
    const {decodedToken} = useJwt(auth?.token as string)

    const [getChars, { loading, data }] = useLazyQuery(characterListQuery);

    const isAvailable = (char: Character) => {
        const now = DateTime.now();
        const lastFight = DateTime.fromMillis(parseInt(char?.lastFight as string));
        console.log(now.diff(lastFight, 'hours'))
            if (now.diff(lastFight, 'hours').hours > 1) {
                return true
            } else {
                return false
            }
    }

    useEffect(() => {
        if(decodedToken?.id || refresh) {
            setUserId(decodedToken.id)
            getChars({variables: {userId: decodedToken.id}})
        }
        if(data){
            console.log(`Character list:: ${JSON.stringify(data)}`)
            setCharList(data.characters);
        }

        
    }, [decodedToken, data, getChars, refresh]);

    if(loading) return (<div>loading</div>);
    const creationOK = charList?.length as number < 10;

    const handleSelect = (id: string) => {
        const char: Character = charList?.find((c) => c.id === id) as Character;
        
        if(char && isAvailable(char)){
            setCharacter(char);            
        }
    }

    if(!charList || charList?.length <= 0) return (
        <Grid container direction="row" justify="center" className={classes.empty}>
            <CreateCharacterButton userId={userId} action={setRefresh}/>
        </Grid>
        
    )
    else return(
        <Grid container direction="row">
            <Grid container item xs={6} direction="column">
                {
                    charList?.map((c: Character) => {return (
                        <Grid key={c.id} onClick={() => handleSelect(c.id)} className={classes.chargrid}>
                            <Paper className={isAvailable(c) ? classes.charLabel : classes.disabled}>
                                
                                <Grid container item direction="row" justify="space-evenly" alignItems="center">
                                    {c.name} Niveau {c.rank}
                                    {
                                        c.skillpoints > 0?
                                            <>
                                                <Button onClick={()=> setOpenEditor(true)} color="primary" variant="outlined">Monter de niveau</Button>
                                                <CharacterEditor open={openEditor} userId={userId} action={setRefresh} character={c}/>

                                            </>
                                        : undefined
                                    }
                                </Grid>
                                
                            </Paper>
                        </Grid>
                        
                    )})
                }
                {creationOK?<CreateCharacterButton userId={userId} action={setRefresh}/>: undefined}
            </Grid>
            <Grid container item xs={6} direction="column" alignItems="center" justify="center">
                {character ? (
                    <>
                        <Grid item container justify="center" alignItems="center" direction="column" md={4} className={classes.chargrid}>
                            <CharacterSheet character={character}/>
                        </Grid> 
                        <div>
                            <Button color="primary" variant="contained" >
                                <Link to={`/arena?charId=${character.id}`} className={classes.create}>Entrer dans l'arène</Link>
                            </Button> 
                        </div>
                        
                    </>
                ) : undefined}
            </Grid>
        </Grid>
            
    )
}

function CreateCharacterButton(props: any) {
    const classes = useStyles();
    const [open, setOpen] = useState<boolean>(false);
    const handleClick = () => {
        setOpen(true)
    }
    return (
        <>
            <Button variant="contained" color="primary" className={classes.create} onClick={handleClick}>Nouveau Personnage</Button>
            <CharacterEditor open={open} userId={props.userId} action={props.action}/>
        </>
    )
}