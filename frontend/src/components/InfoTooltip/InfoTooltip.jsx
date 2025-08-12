import success from "../../images/success.png";
import failure from "../../images/failure.png";
import closeModal from "../../images/close-modal.png";

function InfoTooltip({ status, message, onClose }) {
  const icon = status === "success" ? success : failure;

  return (
    <>
      <div className="modal__wrapper">
        <img
          className="close__infotooltip"
          src={closeModal}
          alt=""
          onClick={onClose}
        />
        <div className="infotooltip">
          <img
            className="infotooltip__status"
            src={icon}
            alt={status === "success" ? "Succeso" : "Erro"}
          />
          <p className="infotooltip__description">{message}</p>
        </div>
      </div>
    </>
  );
}

export default InfoTooltip;
