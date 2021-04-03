import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { Button, Grid, Hidden, makeStyles, Paper, Typography } from '@material-ui/core';
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

const characterFights = gql`
    query fightsForCharacter($charId: String){
        fightsForCharacter(charId: $charId){
            id
            player{
                name
            }
            enemy{name}
            winner{id}
            looser{id}
            date
        }
    }
`

export default function CharacterSelect(props: any){
    const classes = useStyles();
    const [charList, setCharList] = useState<Character[]>();
    const [character, setCharacter] = useState<Character>();
    const [fightHistory, setFightHistory] = useState<any>();
    const [userId, setUserId] = useState<string>();
    const [refresh, setRefresh] = useState(false);
    const [openEditor, setOpenEditor] = useState(false);
    const [displayHisto, setDisplayHisto] = useState(false);
    let auth = useAuth();
    const {decodedToken} = useJwt(auth?.token as string)

    const [getChars, { loading, data: characterList }] = useLazyQuery(characterListQuery, {fetchPolicy:'no-cache'});
    const [getFightHistory, {data: fights, error: errorFights}] = useLazyQuery(characterFights);

    const isAvailable = (char: Character) => {
        const now = DateTime.now();
        const lastFight = DateTime.fromMillis(parseInt(char?.lastFight as string));
            if (now.diff(lastFight, 'hours').hours > 1) {
                return true
            } else {
                return false
            }
    }

    useEffect(() => {
        if((decodedToken?.id || refresh) && !charList) {
            setUserId(decodedToken.id)
            getChars({variables: {userId: decodedToken.id}})
        }
        if(characterList){
            console.log(`Character list:: ${JSON.stringify(characterList)}`)
            setCharList(characterList.characters);
        }
        if(fights){
            console.log(`fights:: ${JSON.stringify(fights)}`)
            setFightHistory(fights.fightsForCharacter)
        }
    }, [decodedToken, characterList, getChars, refresh, fights,errorFights]);

    if(loading) return (<div>loading</div>);
    const creationOK = charList?.length as number < 10;

    const handleSelect = (id: string) => {
        const char: Character = charList?.find((c) => c.id === id) as Character;
        
        if(char && isAvailable(char)){
            setCharacter(char);
            console.log('getting history')  
            getFightHistory({variables: {charId: id}}) ;     
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
                        <Grid item container alignItems="center" justify="space-evenly" direction="row">
                            <Button color="primary" variant="outlined" onClick={() => setDisplayHisto(!displayHisto)}>Historique</Button>
                            <Button color="primary" variant="contained" >
                                <Link to={`/arena?charId=${character.id}`} className={classes.create}>Entrer dans l'arène</Link>
                            </Button> 
                        </Grid>
                        {displayHisto?
                        <Grid item container direction="column" justify="center" alignItems="center" hidden={displayHisto}>
                            {
                                fightHistory?.map((f: any) => {
                                    return(
                                        <Paper style={{padding: '1rem'}} key={fightHistory?.indexOf(f)}>
                                            <Grid container item direction="column" justify="center" alignItems="center">
                                                <Typography variant="body1">Le {DateTime.fromMillis(parseInt(f.date)).toLocaleString(DateTime.DATETIME_MED)}</Typography>
                                                <Typography variant="body1">Contre {f.enemy.name}</Typography>
                                                <Typography variant="body1">{f.winner.id === character.id? 'Victoire' : 'Defaite'}</Typography>
                                            </Grid>
                                        </Paper>
                                    )
                                })
                            }

                        </Grid>
                        : undefined}
                        
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