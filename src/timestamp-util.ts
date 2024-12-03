export function getSecondsOffsetFromTimestamp(timestamp: number) {

    const totalSeconds = Math.floor(timestamp / 1000);

    return totalSeconds % 60;

}