export async function executeFight(playerId: string, opponentId: string) {
    const body = {
        playerId: playerId,
        opponentId: opponentId
    }
    const fightResult = await (await fetch('api/fight', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
    })).json();

    return fightResult
}