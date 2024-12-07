export function getSecondsOffsetFromTimestamp(timestamp: number) {

    const totalSeconds = Math.floor(timestamp / 1000);

    return totalSeconds % 60;

}

export function toTitleCase(str: string) {
    return str
    .split(' ') // Split the string into an array of words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
    .join(' '); // Join the words back into a single string
}