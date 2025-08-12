import closeModal from "../../images/close-modal.png";

function Popup(props) {
  const { title, children, onClose } = props;

  return (
    <div className="popup opened">
      <div
        className={`popup__content ${
          !title ? "popup__content_content_image" : ""
        }`}
      >
        <img
          className="popup__close"
          src={closeModal}
          alt="botão de fechar modal"
          onClick={onClose}
        />
        {title && <h2 className="popup__title">{title}</h2>}
        {children}
      </div>
    </div>
  );
}

export default Popup;
