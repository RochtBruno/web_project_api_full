import { useContext, useEffect, useState } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function EditProfilePopup({ onClose }) {
  const { currentUser, handleUpdateUser } = useContext(CurrentUserContext);
  const [name, setName] = useState(currentUser.name || "");
  const [about, setAbout] = useState(currentUser.about || "");

  useEffect(() => {
    setName(currentUser.name || "");
    setAbout(currentUser.about || "");
  }, [currentUser]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleAboutChange = (e) => {
    setAbout(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdateUser(name, about);
    onClose();
  };

  return (
    <form className="popup__form" onSubmit={handleSubmit}>
      <input
        name="name"
        type="text"
        id="nameInput"
        className="popup__input"
        placeholder="Nome"
        required
        value={name}
        onChange={handleNameChange}
      />

      <input
        name="job"
        type="text"
        id="jobInput"
        className="popup__input"
        placeholder="Sobre mim"
        required
        value={about}
        onChange={handleAboutChange}
      />

      <button type="submit" className="popup__btn">
        Salvar
      </button>
    </form>
  );
}

export default EditProfilePopup;
