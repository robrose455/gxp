
interface RoleImageProps {
    role: string
}

const RoleImage: React.FC<RoleImageProps> = ({ role }) => {

    const imageURL = `role-icons/${role}.png`;

    return (
        <img className="role-image" src={imageURL} alt="Role" />
    )
}

export default RoleImage
