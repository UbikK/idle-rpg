import { Card, CardContent, Grid, Typography } from "@material-ui/core";
import React from "react";

export default function CharacterSheet(props: any){
    
    if(!props.character){
        return (
            <></>
        )
    } else {
        return(
            <Card>
                <CardContent>
                    <Grid container justify="center" alignContent="center" alignItems="center" direction="column">
                        <Typography variant="h5">{props.character?.name}</Typography>
                        <Typography variant="h6">Niveau: {props.character?.rank}</Typography>
                        <Typography variant="h6">Endurance: {props.character?.health}</Typography>
                        <Typography variant="h6">Attaque: {props.character?.attack}</Typography>
                        <Typography variant="h6">Défense: {props.character?.defense}</Typography>
                        <Typography variant="h6">Magik: {props.character?.magik}</Typography>
                    </Grid>
                </CardContent>
            </Card>
        )
    }
    
}