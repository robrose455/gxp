import { Team, EventType, Metric } from "./constants"

export type MatchPreview = {
    accountId: string,
    matchId: string,
    playerChampion: string,
    playerParticipantId: string,
    enemyChampion: string,
    enemyParticipantId: string,
    role: string,
    win: boolean,
}

export type Participant = {
    id: string,
    champion: string,
    role: string,
    team: Team
}

export type Event = {
    id: string,
    type: EventType,
    subtype?: string,
    timestamp: number,
    frame: number,
    team: Team,
    killer: string,
    assists?: string
}

export type MetricData = {
    id: string,
    metric: Metric,
    data: number[]
}

export type Data = {
    id: string,
    gold: number[],
    xp: number[],
    level: number[],
    cs: number[]
}


export type MatchData = {
    participants: Participant[];
    events: Event[],
    data: Data[]
}

export type ActivePlayer = {
    id: string;
    champion: string;
    role: string;
    team: string;
}

export type Dataset = {
    metric: string,
    mode: string,
    data: number[]
    display: MetricDisplay
}

export type MetricDisplay = {
    title: string;
    theme: any; 
}

export type TrendContext = {
    data: any
    resource: string,
    role: string,
}

export type TrendRoleData = {

}
