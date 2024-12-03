export const ROLES = ['Top', 'Jungle', 'Mid', 'ADC', 'Support'];

export const MARKERS = ['Baron', 'Death', 'Kill'];

export enum Metric {
    XP = 'xp',
    GOLD = 'gold',
    CS = 'cs'
}

export enum Mode {
    GROWTH = 'growth',
    ADVANTAGE = 'advantage'
}

export enum Team {
    ALLY = 'ally',
    ENEMY = 'enemy'
}

export enum EventType {
    KILL = 'kill',
    TURRET = 'turret',
    OBJECTIVE = 'objective'
}