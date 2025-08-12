import logo from "../../images/logo.png";
import { useLocation, Link } from "react-router-dom";
import { useState } from "react";

function Header({ handleLogout, userEmail }) {
  const [menuMobileOpen, setMenuMobileOpen] = useState(false);
  const [closeMenuMobile, setCloseMenuMobile] = useState(false);

  const toggleMenuMobile = () => {
    setMenuMobileOpen((open) => !open);
    setCloseMenuMobile((active) => !active);
  };

  const location = useLocation();

  let btnText = "";
  let btnHref = "";

  if (location.pathname === "/signup") {
    btnText = "Faça login";
    btnHref = "/signin";
  } else if (location.pathname === "/signin") {
    btnText = "Cadastre-se";
    btnHref = "/signup";
  } else if (location.pathname === "/") {
    btnText = "Sair";
  }
  return (
    <>
      {location.pathname === "/" && (
        <div className={`menu-mobile-panel ${menuMobileOpen ? "is-open" : ""}`}>
          <p className="header__email">{userEmail}</p>
          <button className="header__btn-logout" onClick={handleLogout}>
            {btnText}
          </button>
        </div>
      )}
      <header className="header">
        <img className="header__logo" src={logo} alt="logo do website" />

        {location.pathname === "/" ? (
          <div className="header__info-desktop">
            <p className="header__email">{userEmail}</p>
            <button className="header__btn-logout" onClick={handleLogout}>
              {btnText}
            </button>
          </div>
        ) : (
          <Link className="header__btn" to={btnHref}>
            {btnText}
          </Link>
        )}

        {location.pathname === "/" && (
          <div
            className={`menu-mobile ${closeMenuMobile ? "active" : ""}`}
            onClick={toggleMenuMobile}
          >
            <div className="line-1"></div>
            <div className="line-2"></div>
          </div>
        )}
      </header>
    </>
  );
}

export default Header;
