import { useState } from "react";
import InfoTooltip from "../InfoTooltip/InfoTooltip.jsx";
import { register } from "../../utils/auth.js";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [errorInfo, setErrorInfo] = useState("");
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [tooltipStatus, setTooltipStatus] = useState("success");
  const [tooltipMessage, setTooltipMessage] = useState("");
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (email == "" || password == "") {
        throw new Error("Campos vazios não são válidos");
      }
      const response = await register({ email, password });
      if (response.status == 400) {
        const message = await response.json();
        throw new Error(message.error);
      }
      const result = await response.json();
      if (!result.data.email || !result.data._id) {
        throw new Error(`Data não recebida: ${result}`);
      }
      setTooltipStatus("success");
      setTooltipMessage("Cadastro realizado com sucesso");
      setIsTooltipOpen(true);
      setShouldRedirect(true);
      setEmail("");
      setPassword("");
    } catch (error) {
      setTooltipStatus("failure");
      setTooltipMessage(
        error.message && error.message !== "undefined"
          ? error.message
          : "Erro ao cadastrar usuário, tente novamente"
      );
      setIsTooltipOpen(true);
      setShouldRedirect(false);
      setEmail("");
      setPassword("");
    }
  }

  const handleCloseTooltip = () => {
    setIsTooltipOpen(false);
    if (shouldRedirect) {
      navigate("/", { replace: true });
    }
  };

  return (
    <>
      <div className="register">
        <h2 className="register__title">Inscreva-se</h2>
        <form className="register__form" action="" onSubmit={handleSubmit}>
          <input
            className="register__input"
            type="email"
            value={email}
            name="email"
            placeholder="E-mail"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />

          <input
            className="register__input"
            type="password"
            value={password}
            name="password"
            placeholder="Senha"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <button className="register__btn">Inscrever-se</button>
        </form>
        <a className="register__link" href="/signin">
          Já é membro? Faça o login aqui!
        </a>
      </div>
      {isTooltipOpen && (
        <div className="popup__overlay">
          <InfoTooltip
            status={tooltipStatus}
            message={tooltipMessage}
            onClose={handleCloseTooltip}
          />
        </div>
      )}
    </>
  );
}

export default Register;
