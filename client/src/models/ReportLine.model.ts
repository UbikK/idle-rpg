export default interface ReportLine{
    roundNumber: number;
    player: {
        attackValue: number;
        healthLost: number
    },
    enemy: {
        attackValue: number;
        healthLost: number
    }
    fightStatus?: 'won' | 'lost';
}