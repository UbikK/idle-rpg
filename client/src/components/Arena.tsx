import { useLazyQuery } from '@apollo/client';
import { Button, Container, Grid, Typography, Paper } from '@material-ui/core';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Character from '../models/Character.model';
import ReportLine from '../models/ReportLine.model';
import { executeFight } from '../services/ApiService';
import { useUrlQuery } from '../services/Utils';
import CharacterSheet from './CharacterSheet';

const getFightQuery = gql`
    query fight($charId: String!){
        fightSetting(charId: $charId){
            player{
                id,
                name,
                health, 
                attack,
                defense, 
                magik,
                rank
            },
            opponent{
                id,
                name,
                health, 
                attack,
                defense, 
                magik,
                rank
            }
        }
    }
`



export default function Arena(){
    const query = useUrlQuery();
    const history = useHistory();
    const charId = query.get('charId');
    const [playerId] = useState<string>(charId as string);
    const [player, setPlayer] = useState<Character>();
    const [opponent, setOpponent] = useState<Character>();
    const [getFight, {data}] = useLazyQuery(getFightQuery);
    const [combatReport, setCombatReport] = useState<any[]>();
    const [winner, setWinner] = useState<boolean>();
    const [startFight, setStartFight] = useState<boolean>(false)
    const [endFight, setEndFight] = useState<boolean>(false)

    const goBack = () => {
        history.goBack();
    }

    const launchFight = () => {
        setStartFight(true);
    }

    useEffect(() => {
        if(playerId) {
            getFight({variables: {charId: playerId}, context:{fetchPolicy: 'network-only', newFecthPolicy: 'cache-first'}});
        }

        if (data) {
            console.log(data)
            setOpponent(data.fightSetting.opponent);
            setPlayer(data.fightSetting.player);
        }
        if(combatReport){
            setEndFight(true)
        }
    }, [playerId, data, getFight, combatReport]);

    useEffect(() => {
        async function getCombatReport (playerId: string, opponentId: string) {
            /* const body = {
                playerId: playerId,
                opponentId: opponentId
            }
            const request = await fetch('api/fight', {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {'Content-Type': 'application/json'}
            }); */
    
            const fightResult = await executeFight(playerId, opponentId);
            console.log(fightResult)
            setCombatReport(fightResult.reportList);
            setWinner(fightResult.winner);
        } 
        if (startFight && !endFight) getCombatReport(playerId, opponent?.id as string);
        
    }, [startFight, opponent?.id, playerId, endFight])
    
    
    
    return(
        <Container style={{padding: '1rem'}}>
            <Grid container direction="column" alignItems="center" justify="center">
                <Grid container item justify="center" direction="column" alignItems="center">
                    <Grid container item xs={6} direction="row" justify="space-evenly" alignItems="center" style={{padding: '1rem'}}>
                        <CharacterSheet character={player}/>
                        <Typography variant="h4">VS</Typography>
                        <CharacterSheet character={opponent}/>
                    </Grid>
                    <Button color="primary" variant="contained" disabled={startFight || endFight} onClick={() => launchFight()}>Attaquer !</Button>
                </Grid>
                <Grid container item alignItems="center" justify="center">
                    {
                        combatReport? 
                           
                            <Grid container item direction="column" justify="center" alignItems="center" style={{padding: '1rem'}}>
                                <Typography variant="h5">{winner ? 'VICTOIRE' : 'DEFAITE'}</Typography>
                                <Button variant="contained" color="primary" onClick={goBack} style={{padding: '1rem', margin: 'auto'}}>Revenir à la selection de personnage</Button>
                            </Grid>
                                
                                    
                            
                        : undefined
                    }
                </Grid>
                <Grid item container direction="column" xs={6} justify="space-evenly" spacing={1}>
                    {
                        combatReport?.map((reportLine: ReportLine) => {
                            return (
                                <Grid item container direction="column" justify="center" key={combatReport?.indexOf(reportLine)}>
                                    <Paper>
                                        <Grid item container direction="column" justify="center" alignItems="center">
                                            <Typography>Tour n° {reportLine.roundNumber} :</Typography>
                                            <Typography>{player?.name} inflige {reportLine.player.attackValue} points de dégats</Typography>
                                            <Typography>{opponent?.name} perd {reportLine.enemy.healthLost} points de vie</Typography>
                                            <Typography>{opponent?.name} inflige {reportLine.enemy.attackValue} points de dégats</Typography>
                                            <Typography>{player?.name} perd {reportLine.player.healthLost} points de vie</Typography>
                                        </Grid>
                                    </Paper>
                                    
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </Grid>
        </Container>
    )
}