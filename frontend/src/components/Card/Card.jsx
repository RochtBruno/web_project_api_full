import deleteCard from "../../images/Trash.svg";
import likeIcon from "../../images/Group.svg";
import likeActiveIcon from "../../images/Union.svg";
import ImagePopup from "../ImagePopup/imagePopup";

function Card(props) {
  const { name, link, likes } = props.card;

  const isLiked = likes.length

  const handleDelete = () => {
    if (props.onDelete) {
      props.onDelete(props.card);
    }
  };

  const handleImageClick = () => {
    const imageComponent = {
      title: "",
      children: (
        <ImagePopup card={props.card} onClose={props.handleOpenPopup} />
      ),
    };
    props.handleOpenPopup(imageComponent);
  };

  return (
    <div className="cards__card">
      <img
        className="cards__card-delete"
        src={deleteCard}
        alt="Deletar"
        onClick={handleDelete}
      />
      <div className="cards__card-image" onClick={handleImageClick}>
        <img
          className="cards__card-image-inner"
          src={link}
          alt="Imagem do card"
        />
      </div>
      <div className="cards__card-infos">
        <h2 className="cards__card-title">{name}</h2>
        <div className="card__card-like-info">
          <img
          className="cards__card-like"
          src={isLiked ? likeActiveIcon : likeIcon}
          alt="Curtir"
          onClick={props.onLike}
        />
          <span className="cards__card-number-likes" style={{ fontSize: "16px", color: "#222" }}>
            {likes.length}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Card;
