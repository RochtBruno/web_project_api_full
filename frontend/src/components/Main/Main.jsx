import { useEffect, useContext } from "react";
import editProfile from "../../images/edit.png";
import imageAddCard from "../../images/add.png";
import Popup from "../Popup/Popup.jsx";
import EditAvatarPopup from "../EditAvatarPopup/EditAvatarPopup.jsx";
import EditProfilePopup from "../EditProfilePopup/EditProfilePopup.jsx";
import NewCard from "../NewCard/NewCard.jsx";
import Card from "../Card/Card.jsx";
import CurrentUserContext from "../../contexts/CurrentUserContext.js";

function Main({
  getCardList,
  cardState,
  onCardLike,
  onCardDelete,
  popupState,
  setPopupState,
  onAddPlaceSubmit,
  isLoading,
}) {
  const { currentUser } = useContext(CurrentUserContext);

  useEffect(() => {
    getCardList();
  },[]);

  const editProfilePopup = {
    title: "Editar perfil",
    children: <EditProfilePopup onClose={handleClosePopup} />,
  };
  const editAvatarPopup = {
    title: "Atualizar a foto do perfil",
    children: <EditAvatarPopup onClose={handleClosePopup} />,
  };
  const newCardPopup = {
    title: "Novo local",
    children: (
      <NewCard onAddPlaceSubmit={onAddPlaceSubmit} onClose={handleClosePopup} />
    ),
  };

  const deleteCardPopup = (cardState) => {
    setPopupState({
      title: "Excluir imagem?",
      children: (
        <button
          type="button"
          className="popup__btn"
          onClick={() => onCardDelete(cardState)}
        >
          Sim
        </button>
      ),
    });
  };

  function handleOpenPopup(popupState) {
    setPopupState(popupState);
  }

  function handleClosePopup() {
    setPopupState(null);
  }

  return (
    <>
      <section className="profile">
        <div
          className="profile__image"
          onClick={() => handleOpenPopup(editAvatarPopup)}
        >
          <img src={currentUser.avatar} alt="foto de perfil" />
        </div>
        <div className="profile__infos">
          <h2 className="profile__infos-title">{currentUser.name || ""}</h2>
          <p className="profile__infos-description">
            {currentUser.about || ""}
          </p>
          <div
            className="profile__infos-edit"
            onClick={() => handleOpenPopup(editProfilePopup)}
          >
            <img src={editProfile} alt="botão de editar perfil" />
          </div>
        </div>
        <div
          className="profile__button"
          onClick={() => handleOpenPopup(newCardPopup)}
        >
          <div className="profile__button-rectangle">
            <img src={imageAddCard} alt="botão de adicionar card" />
          </div>
        </div>

        {popupState && (
          <>
            <div className="popup__overlay" onClick={handleClosePopup}></div>
            <Popup onClose={handleClosePopup} title={popupState.title}>
              {popupState.children}
            </Popup>
          </>
        )}
      </section>
      {isLoading && <div className="loading-spinner" id="loadingSpinner"></div>}
      <ul className="cards">
        {cardState.map((card) => (
          <Card
            key={card._id}
            card={card}
            onDelete={deleteCardPopup}
            handleOpenPopup={handleOpenPopup}
            onLike={() => onCardLike(card)}
          />
        ))}
      </ul>
    </>
  );
}

export default Main;
