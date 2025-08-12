import { useState } from "react";

function NewCard({ onAddPlaceSubmit, onClose }) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddPlaceSubmit({ name, link });
    setName("");
    setLink("");
    if (onClose) onClose();
  };

  return (
    <form className="popup__form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        id="titleInput"
        className="popup__input"
        placeholder="Título"
        required
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="url"
        name="link"
        id="linkInput"
        className="popup__input"
        placeholder="Link da imagem"
        required
        onChange={(e) => setLink(e.target.value)}
      />
      <button type="submit" className="popup__btn">
        Criar
      </button>
    </form>
  );
}

export default NewCard;
