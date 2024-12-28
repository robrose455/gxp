import './ChampionImage.css'

interface ChampionImageProps {
    champion: string
}

const formatChampion = (name: string) => {
    if (name === "Lee Sin") {
        return "LeeSin";
    } else if (name === "Fiddle Sticks") {
        return "FiddleSticks"
    } else if (name === "Rek Sai") {
        return "RekSai"
    } else if (name === "Twisted Fate") {
        return "TwistedFate"
    } else if (name === "Tahm Kench") {
        return "TahmKench"
    } else {
        return name
    }
}

const ChampionImage: React.FC<ChampionImageProps> = ({ champion }) => {

    const imageURL = `https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${formatChampion(champion)}.png`;

    return (
        <img className="champion-image" src={imageURL} alt={champion} />
    )
}

export default ChampionImage
