import Header from "./Header/Header.jsx";
import Footer from "./Footer/Footer.jsx";
import Main from "./Main/Main.jsx";
import Register from "./Register/Register.jsx";
import Login from "./Login/Login.jsx";
import NotFound from "./NotFound/NotFound.jsx";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.jsx";
import { useState, useEffect, useCallback } from "react";
import api from "../utils/api-front.js";
import CurrentUserContext from "../contexts/CurrentUserContext.js";
import { Routes, Route, useNavigate } from "react-router-dom";
import { checkToken } from "../utils/auth-front.js";
import InfoTooltip from "./InfoTooltip/InfoTooltip.jsx";

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [card, setCard] = useState([]);
  const [popup, setPopup] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState("")
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [tooltipStatus, setTooltipStatus] = useState("success");
  const [tooltipMessage, setTooltipMessage] = useState("");

  const navigate = useNavigate();

  const handleLogout = () => {
    setLoggedIn(false);
    setCurrentUser({})
    localStorage.removeItem("jwt");
    navigate("/signin", { replace: true });
  };

  const handleCheckToken = useCallback(async () => {
    const storedToken = localStorage.getItem("jwt");
    setToken(storedToken)
    if (!storedToken) {
      console.log("token not found");
      navigate("/signin", { replace: true });
      return;
    }
    try {
      const response = await checkToken({ token: storedToken });
      if (response.status != 200) {
        const message = await response.json();
        throw new Error(message.error);
      }
      const result = await response.json();
      if (!result.data || !result.data.id) {
        handleLogout();
        throw new Error(`Data not receivied: ${result}`);
      }
      setLoggedIn(true);
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
    }
  }, [navigate]);

  useEffect(() => {
    if(isLoggedIn && token){
      api
      .getUser(token)
      .then((data) => setCurrentUser(data.data))
      .catch((err) =>
        console.log("Erro ao buscar informações do usuário: ", err)
      );
    }
  }, [isLoggedIn, token]);

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt");
    setToken(storedToken)
    if (storedToken) {
      handleCheckToken();
    }
  }, []);

  const handleUpdateUser = (name, about) => {
    setLoading(true);
    api
      .updateUser(name, about, token)
      .then((userData) => {
        setCurrentUser(userData.data);
      })
      .catch((err) => {
        console.log("Erro ao atualizar usuário", err);
      })
      .finally(() => setLoading(false));
  };

  const handleUpdateAvatar = (avatarUrl) => {
    setLoading(true);
    api
      .updateAvatar(avatarUrl, token)
      .then((userData) => {
        if(userData && userData.data){
          setCurrentUser(userData.data)
        }else{
          console.log("resposta inesperada ao atualizar o avatar")
        }
      })
      .catch((err) => console.log("Erro ao mudar avatar", err))
      .finally(() => setLoading(false));
  };

  const getCardList = () => {
    console.log("get card list")
    setLoading(true);
    api
      .getInitialCards(token)
      .then((data) => {
        const cardsWithIsLiked = data.data.map(card => ({
          ...card,
          isLiked: card.likes.includes(currentUser.id)
        }));
        setCard(cardsWithIsLiked);
        console.log(card)
      })
      .catch((err) => console.log("Erro ao buscar cards-> ", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isLoggedIn && token && currentUser.id) {
      setLoading(true);
      api
        .getInitialCards(token)
        .then((data) => {
          const cardsWithIsLiked = data.data.map(card => ({
            ...card,
            isLiked: card.likes.includes(currentUser.id)
          }));
          setCard(cardsWithIsLiked);
        })
        .catch((err) => console.log("Erro ao buscar cards-> ", err))
        .finally(() => setLoading(false));
    }
  }, [isLoggedIn, token, currentUser.id]);

  const handleAddPlaceSubmit = (card) => {
    setLoading(true);
    api
      .createCard(card, token)
      .then((newCard) => setCard((prevCards) => [newCard, ...prevCards]))
      .catch((err) => console.log("Erro ao criar card ", err))
      .finally(() => setLoading(false));
  };

  const handleCardLike = (card) => {
    const likeRequest = card.isLiked
      ? api.removeLike(card._id, token)
      : api.addLike(card._id, token);

    likeRequest
      .then((updatedCard) => {
        setCard((prevCards) =>
          prevCards.map((c) =>
            c._id === card._id
              ? { ...c, ...updatedCard, isLiked: !card.isLiked }
              : c
          )
        );
      })
      .catch((err) => {
        console.error("Erro ao atualizar like:", err);
      });
  };

  const handleCardDelete = (card) => {
    setLoading(true);
    api
      .deleteCard(card._id, token)
      .then((response) => {
        if(response && response.message === "Card deletado com sucesso"){
          setCard((prevCards) => prevCards.filter((c) => c._id !== card._id));
        }else if(response && response.message === "Você não tem permissão para deletar o card"){
          setTooltipStatus("failure");
          setTooltipMessage("Você não tem permissão para deletar o card");
          setIsTooltipOpen(true);
        }
        setPopup(null);
      })
      .catch((err) => {
        if(err && err.message === "Você não tem permissão para deletar o card"){
          setTooltipStatus("failure");
          setTooltipMessage("Você não tem permissão para deletar o card");
          setIsTooltipOpen(true);
        } else {
          setTooltipStatus("failure");
          setTooltipMessage("Erro ao deletar card");
          setIsTooltipOpen(true);
        }
        setPopup(null);
      })
      .finally(() => setLoading(false));
  };

  const handleCloseTooltip = () => {
    setIsTooltipOpen(false);
  };

  return (
    <div className="page">
      {isTooltipOpen && (
        <div className="popup__overlay">
          <InfoTooltip
            status={tooltipStatus}
            message={tooltipMessage}
            onClose={handleCloseTooltip}
          />
        </div>
      )}
      <CurrentUserContext.Provider
        value={{ currentUser, handleUpdateUser, handleUpdateAvatar }}
      >
        <Header handleLogout={handleLogout} userEmail={currentUser.email} />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Main
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  getCardList={getCardList}
                  onAddPlaceSubmit={handleAddPlaceSubmit}
                  cardState={card}
                  popupState={popup}
                  setPopupState={setPopup}
                  isLoading={isLoading}
                />
              </ProtectedRoute>
            }
          />
          <Route path="/signup" element={<Register />} />
          <Route path="/signin" element={<Login setLoggedIn={setLoggedIn} setToken={setToken} setCurrentUser={setCurrentUser} currentUser={currentUser} setCard={setCard}/>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
