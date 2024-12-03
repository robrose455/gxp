import './ChampionImage.css'

interface ChampionImageProps {
    champion: string
}

const ChampionImage: React.FC<ChampionImageProps> = ({ champion }) => {

    const imageURL = `https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${champion}.png`;

    return (
        <img className="champion-image" src={imageURL} alt="Gragas" />
    )
}

export default ChampionImage
