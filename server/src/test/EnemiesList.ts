export const enemies = [
    {
        "name": "Rat",
        "rank": 1,
        "health": 10,
        "attack": 2,
        "defense": 0,
        "magik": 0,
        
    },
    {
        "name": "Loup",
        "rank": 3,
        "health": 15,
        "attack": 5,
        "defense": 2,
        "magik": 0
    },
    {
        "name": "Gobelin",
        "rank": 4,
        "health": 20,
        "attack": 10,
        "defense": 5,
        "magik": 2
    },
    {
        "name": "Araignée",
        "rank": 2,
        "health": 12,
        "attack": 3,
        "defense": 0,
        "magik": 0
    },
    {
        "name": "Orc",
        "rank": 6,
        "health": 25,
        "attack": 15,
        "defense": 10,
        "magik": 0
    },
    {
        "name": "Uruk",
        "rank": 10,
        "health": 30,
        "attack": 20,
        "defense": 15,
        "magik": 5
    },
    {
        "name": "Magicien",
        "rank": 20,
        "health": 15,
        "attack": 2,
        "defense": 20,
        "magik": 20
    }
]

export const sortedByRank = [
    {key: 0, list: [{
        "name": "Rat",
        "id": "rat",
        "rank": 1,
        "health": 10,
        "attack": 2,
        "defense": 0,
        "magik": 0,
        "fightsAsEnemy": [{
            "playerCharacterId": 'testChar',
            "enemyCharacterId": 'rat'
        },
        {
            "playerCharacterId": 'testChar',
            "enemyCharacterId": 'rat'
        },
        {
            "playerCharacterId": 'testChar',
            "enemyCharacterId": 'rat'
        }]
    },{
        "name": "Araignée",
        "rank": 1,
        "health": 12,
        "attack": 3,
        "defense": 0,
        "magik": 0,
        "fightsAsEnemy": []
        
    }]},
    {key: 1, list: [{
        "name": "Araignée",
        "rank": 2,
        "health": 12,
        "attack": 3,
        "defense": 0,
        "magik": 0,
        "fightsAsEnemy": []
    }]},
    {key: 2, list: [{
        "name": "Loup",
        "rank": 3,
        "health": 15,
        "attack": 5,
        "defense": 2,
        "magik": 0,
        "fightsAsEnemy": []
    }]},
    {key: 3, list: [{
        "name": "Gobelin",
        "rank": 4,
        "health": 20,
        "attack": 10,
        "defense": 5,
        "magik": 2,
        "fightsAsEnemy": []
    }]},
    {key: 5, list: [{
        "name": "Orc",
        "rank": 6,
        "health": 25,
        "attack": 15,
        "defense": 10,
        "magik": 0,
        "fightsAsEnemy": []
    }]},
    {key: 9, list: [{
        "name": "Uruk",
        "rank": 10,
        "health": 30,
        "attack": 20,
        "defense": 15,
        "magik": 5,
        "fightsAsEnemy": []
    }]},
    {key: 19, list: [{
        "name": "Magicien",
        "rank": 20,
        "health": 15,
        "attack": 2,
        "defense": 20,
        "magik": 20,
        "fightsAsEnemy": []
    }]},
]

export const sortedByRankOnlyOne = [
    {key: 0, list: [{
        "name": "Rat",
        "rank": 1,
        "health": 10,
        "attack": 2,
        "defense": 0,
        "magik": 0,
    },]},
    {key: 1, list: [{
        "name": "Araignée",
        "rank": 2,
        "health": 12,
        "attack": 3,
        "defense": 0,
        "magik": 0
    }]},
    {key: 2, list: [{
        "name": "Loup",
        "rank": 3,
        "health": 15,
        "attack": 5,
        "defense": 2,
        "magik": 0
    }]},
    {key: 3, list: [{
        "name": "Gobelin",
        "rank": 4,
        "health": 20,
        "attack": 10,
        "defense": 5,
        "magik": 2
    }]},
    {key: 5, list: [{
        "name": "Orc",
        "rank": 6,
        "health": 25,
        "attack": 15,
        "defense": 10,
        "magik": 0
    }]},
    {key: 9, list: [{
        "name": "Uruk",
        "rank": 10,
        "health": 30,
        "attack": 20,
        "defense": 15,
        "magik": 5
    }]},
    {key: 19, list: [{
        "name": "Magicien",
        "rank": 20,
        "health": 15,
        "attack": 2,
        "defense": 20,
        "magik": 20
    }]},
]

export const sortedByFights = [
    {key: 0, list: [{
        "name": "Araignée",
        "rank": 1,
        "health": 12,
        "attack": 3,
        "defense": 0,
        "magik": 0,
        
    }]},
    {key: 3, list:[
        {
            "name": "Rat",
            "rank": 1,
            "health": 10,
            "attack": 2,
            "defense": 0,
            "magik": 0,
            "fightsAsEnemy": [{
                "playerCharacterId": 'testChar',
                "enemyCharacterId": 'rat'
            },
            {
                "playerCharacterId": 'testChar',
                "enemyCharacterId": 'rat'
            },
            {
                "playerCharacterId": 'testChar',
                "enemyCharacterId": 'rat'
            }]
        }
    ]}
        
]