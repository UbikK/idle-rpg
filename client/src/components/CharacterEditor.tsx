import { useMutation } from "@apollo/client";
import { Button, CssBaseline, Dialog, DialogActions, DialogContent, DialogTitle, Grid, makeStyles, TextField } from "@material-ui/core";
import { AddCircle, RemoveCircle } from "@material-ui/icons";
import gql from "graphql-tag";
import React, { useState, useEffect, ChangeEvent } from "react";

const useStyles = makeStyles((theme) => ({
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
      },
}));

const editCharacterMutation = gql`
    mutation editCharacter($char: CharacterInput!) {
        editCharacter(character: $char){
            id
            name
            rank
            skillpoints
            health
            attack
            defense
            magik
            userId
        }
    }
        
`

export default function CharacterEditor(props: any){
    const [open, setOpen] = useState(props.open);
    const [character] = useState(props.character ?? {name: '', skillpoints: 12, health:10, attack: 0, defense: 0, magik: 0, rank: 1});
    const [editCharacter] = useMutation(editCharacterMutation);
    const [name, setName] = useState<string>();
    const [skillpoints, setSkillpoints] = useState(character.skillpoints);

    const [health, setHealth] = useState(character.health);
    const [attack, setAttack] = useState(character.attack);
    const [defense, setDefense] = useState(character.defense);
    const [magik, setMagik] = useState(character.magik);

    const classes = useStyles();
    const handleClose = () => {
        setOpen(false);
        //props.onClose();
      };
    
    useEffect(() => {
        if(props.open) setOpen(props.open);
        
    }, [props]);

    const getAttrValue = (attr: string) => {
        switch(attr){
            case 'health':
                return {value: health, handler: setHealth};
            case 'attack': 
                return {value: attack, handler: setAttack};
            
            case 'defense':
                return {value: defense, handler: setDefense};

            case 'magik': 
                return {value: magik, handler: setMagik};

            default:
                return {value: 0, handler: () => {console.error('Attribute not found')}};
        }
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        const char = {
            id: character.id??undefined,
            name: name,
            health: health,
            attack: attack,
            defense: defense,
            magik: magik,
            skillpoints: skillpoints,
            rank: character.rank,
            userId: props.userId
        }
        console.log(char)
        editCharacter({variables: {char: char}});
        props.action(true);
        setOpen(false);
        
    }

    const handleAddPoint = (attributeName: string) => {
        const attribute = getAttrValue(attributeName)
        let cost = attributeName === 'health'? 1 : Math.ceil(attribute?.value / 5);
        if (skillpoints > 0) {
            if(cost === 0) cost = 1;
            if (skillpoints >= cost){
                attribute.handler(attribute?.value + 1);
            }
               
            setSkillpoints((skillpoints - cost) < 0 ? 0 : skillpoints - cost)
        }
        
    }

    const handleRemovePoint = (attributeName: string) => {
        const attribute = getAttrValue(attributeName);
        let refund: number = attributeName === 'health' ? 1 : Math.ceil(attribute?.value / 5);;
        if (skillpoints < (health + attack + defense + magik + skillpoints)){
                if(refund === 0) refund = 1;

                if(attribute.value - 1 >= 0 || attribute.value - 1 >= character[attributeName]){
                    attribute.handler(attribute.value - 1);
                }
            setSkillpoints(skillpoints + refund);
        }
    }

    const handleDisabled = (attributeName: string, action: string) => {
        const attribute = getAttrValue(attributeName);
        if (action === 'add'){
            
            const cost = attributeName === 'health'? 1 : Math.ceil(attribute?.value / 5);
            if (skillpoints < cost){
                return true
            }
        } else {
            if(character && character[attributeName] === attribute.value){
                return true;
            }
        }
      
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <CssBaseline/>
            <DialogTitle>{props.character? 'Editer' : 'Créer'} un Personnage</DialogTitle>
            <form onSubmit={handleSubmit} className={classes.form}>
                <DialogContent>
                    <Grid container direction="column" justify="center">
                        {
                            props.character?
                            <TextField
                            name="name"
                            label="Nom"
                            id="name"
                            required
                            margin="normal"
                            value={character?.name}
                            onChange={handleChange}
                            disabled
                            />
                            :
                            <TextField
                            name="name"
                            label="Nom"
                            id="name"
                            required
                            margin="normal"
                            onChange={handleChange}
                        />
                        }
                        <TextField
                            name="skillpoints"
                            label="Points de compétence"
                            id="skillpoints"
                            disabled
                            value={skillpoints}
                            margin="normal"
                        />
                        <Grid container item direction="row" justify="center">
                            <Button color="primary" onClick={() => handleRemovePoint('health')} disabled={handleDisabled('health', 'remove')}><RemoveCircle/></Button>
                            <TextField
                                name="health"
                                label="Endurance"
                                id="health"
                                disabled
                                value={health}
                                margin="normal"
                            />
                            <Button color="primary" onClick={() => handleAddPoint('health')} disabled={handleDisabled('health', 'add')}><AddCircle/></Button>
                        </Grid>
                        <Grid container item direction="row" justify="center">
                            <Button color="primary" onClick={() => handleRemovePoint('attack')} disabled={handleDisabled('attack', 'remove')}><RemoveCircle/></Button>
                            <TextField
                                name="attack"
                                label="Attaque"
                                id="attack"
                                disabled
                                value={attack}
                                margin="normal"
                            />
                            <Button color="primary" onClick={() => handleAddPoint('attack')} disabled={handleDisabled('attack', 'add')}><AddCircle/></Button>
                        </Grid>
                        <Grid container item direction="row" justify="center">
                            <Button color="primary" onClick={() => handleRemovePoint('defense')} disabled={handleDisabled('defense', 'remove')}><RemoveCircle/></Button>
                            <TextField
                                name="defense"
                                label="Defense"
                                id="defense"
                                disabled
                                value={defense}
                                margin="normal"
                            />
                            <Button color="primary" onClick={() => handleAddPoint('defense')} disabled={handleDisabled('defense', 'add')}><AddCircle/></Button>
                        </Grid>
                        <Grid container item direction="row" justify="center">
                            <Button color="primary" onClick={() => handleRemovePoint('magik')} disabled={handleDisabled('magik', 'remove')}><RemoveCircle/></Button>
                            <TextField
                                name="magik"
                                label="Magie"
                                id="magik"
                                disabled
                                value={magik}
                                margin="normal"
                            />
                            <Button color="primary" onClick={() => handleAddPoint('magik')} disabled={handleDisabled('magik', 'add')}><AddCircle/></Button>
                        </Grid>
                        
                    </Grid>
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Annuler
                    </Button>
                    <Button type="submit" color="primary">
                        Valider
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}