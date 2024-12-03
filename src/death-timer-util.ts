export const BRW = {
    1: 10,
    2: 10,
    3: 12,
    4: 12,
    5: 14,
    6: 16,
    7: 20,
    8: 25,
    9: 28,
    10: 32.5,
    11: 35,
    12: 37.5,
    13: 40,
    14: 42.5,
    15: 45,
    16: 47.5,
    17: 50, 
    18: 52.5 
} as Record<number, number>

export function calculateDeathTimer(level: number, minute: number) {

    let TIF = 0;
    let base: number = BRW[level];

    if (minute >= 15 && minute <= 30) {
        TIF = (Math.ceil(2 * (minute - 15)) * 0.425)
    }

    if (minute >= 30 && minute <= 45) {
        TIF = 12.75 + (Math.ceil(2 * (minute - 30)) * 0.30)
    }

    if (minute >= 45) {
        TIF = 21.75 + (Math.ceil(2 * (minute - 45)) * 1.45)
    }

    TIF = TIF * .01;

    const deathTimer = Math.ceil(base + base * TIF);

    return deathTimer;
}