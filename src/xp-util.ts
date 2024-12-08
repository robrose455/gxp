export const XP_LEVEL_MAP = {
    1: 0,
    2: 280,
    3: 660,
    4: 1140,
    5: 1720,
    6: 2400,
    7: 3180,
    8: 4060,
    9: 5040,
    10: 6120,
    11: 7300,
    12: 8580,
    13: 9960,
    14: 11440,
    15: 13020,
    16: 14700,
    17: 16480,
    18: 18360
} as Record<number, number>

// 5680
export function getLevelFromXp(xp: number, numOfPlayers: number) {


    const averageXp = xp / numOfPlayers;

    let levelWithPercent = 0;

    if (averageXp > 18360) {
        levelWithPercent = 18.0
    } else {
        for (const [level, threshold] of Object.entries(XP_LEVEL_MAP)) {
            const numericLevel = Number(level); 
            if (averageXp > threshold) {
                const nextLevelThreshold = XP_LEVEL_MAP[numericLevel + 1]; 
                const rawXpToNextLevel = nextLevelThreshold - threshold; 
                const remainder = averageXp - threshold; 
                const progressToNextLevel = remainder / rawXpToNextLevel
                levelWithPercent = (numericLevel + progressToNextLevel);
            }
        }
    }

    return levelWithPercent;
}