import { useRef, useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function EditAvatarPopup({ onClose }) {
  const avatarRef = useRef();
  const { handleUpdateAvatar } = useContext(CurrentUserContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdateAvatar(avatarRef.current.value);
    onClose();
  };

  return (
    <form className="popup__form" onSubmit={handleSubmit}>
      <input
        type="url"
        name="avatar"
        id="avatarInput"
        className="popup__input"
        placeholder="Link da imagem"
        required
        ref={avatarRef}
      />
      <button type="submit" className="popup__btn">
        Salvar
      </button>
    </form>
  );
}

export default EditAvatarPopup;
