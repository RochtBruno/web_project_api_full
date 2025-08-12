import Header from "./Header/Header.jsx";
import Footer from "./Footer/Footer.jsx";
import Main from "./Main/Main.jsx";
import Register from "./Register/Register.jsx";
import Login from "./Login/Login.jsx";
import NotFound from "./NotFound/NotFound.jsx";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.jsx";
import { useState, useEffect, useCallback } from "react";
import api from "../utils/api.js";
import CurrentUserContext from "../contexts/CurrentUserContext.js";
import { Routes, Route, useNavigate } from "react-router-dom";
import { checkToken } from "../utils/auth.js";

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [card, setCard] = useState([]);
  const [popup, setPopup] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const navigate = useNavigate();

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem("jwt");
    navigate("/signin", { replace: true });
  };

  const handleCheckToken = useCallback(async () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      console.log("token not found");
      navigate("/signin", { replace: true });
      return;
    }
    try {
      const response = await checkToken({ token });
      if (response.status != 200) {
        const message = await response.json();
        throw new Error(message.error);
      }
      const result = await response.json();
      if (!result.data || !result.data._id) {
        handleLogout();
        throw new Error(`Data not receivied: ${result}`);
      }
      setUserEmail(result.data.email);
      setLoggedIn(true);
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
    }
  }, [navigate]);

  useEffect(() => {
    api
      .getUser()
      .then((data) => setCurrentUser(data))
      .catch((err) =>
        console.log("Erro ao buscar informações do usuário: ", err)
      );
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      handleCheckToken();
    }
  }, [localStorage.getItem("jwt")]);

  const handleUpdateUser = (name, about) => {
    setLoading(true);
    api
      .updateUser(name, about)
      .then((userData) => {
        setCurrentUser(userData);
      })
      .catch((err) => {
        console.log("Erro ao atualizar usuário", err);
      })
      .finally(() => setLoading(false));
  };

  const handleUpdateAvatar = (avatarUrl) => {
    setLoading(true);
    api
      .updateAvatar(avatarUrl)
      .then((userData) => setCurrentUser(userData))
      .catch((err) => console.log("Erro ao mudar avatar", err))
      .finally(() => setLoading(false));
  };

  const getCardList = () => {
    setLoading(true);
    api
      .getInitialCards()
      .then((data) => setCard(data))
      .catch((err) => console.log("Erro ao buscar cards-> ", err))
      .finally(() => setLoading(false));
  };

  const handleAddPlaceSubmit = (card) => {
    setLoading(true);
    api
      .createCard(card)
      .then((newCard) => setCard((prevCards) => [newCard, ...prevCards]))
      .catch((err) => console.log("Erro ao criar card ", err))
      .finally(() => setLoading(false));
  };

  const handleCardLike = (card) => {
    const likeRequest = card.isLiked
      ? api.removeLike(card._id)
      : api.addLike(card._id);

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
      .deleteCard(card._id)
      .then(() => {
        setCard((prevCards) => prevCards.filter((c) => c._id !== card._id));
        setPopup(null);
      })
      .catch((err) => {
        console.log("Erro ao deletar card", err);
        setPopup(null);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="page">
      <CurrentUserContext.Provider
        value={{ currentUser, handleUpdateUser, handleUpdateAvatar }}
      >
        <Header handleLogout={handleLogout} userEmail={userEmail} />
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
          <Route path="/signin" element={<Login setLoggedIn={setLoggedIn} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
