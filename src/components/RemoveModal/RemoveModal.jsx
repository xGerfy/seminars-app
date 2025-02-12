import "./RemoveModal.css";

const RemoveModal = ({
  handleModalClick,
  closeModal,
  setError,
  setSeminars,
  seminars,
  editingSeminar,
}) => {
  // функционал удаления семинара
  const deleteSeminar = (id) => {
    fetch(`http://localhost:3000/seminars/${id}`, { method: "DELETE" })
      .then(() => {
        setSeminars(seminars.filter((seminar) => seminar.id !== id));
        closeModal();
      })
      .catch((err) => setError(err));
  };

  return (
    <div className="modal" onClick={handleModalClick}>
      <div>
        <h2>{editingSeminar.title}</h2>
        <p>Вы уверены, что хотите удалить этот семинар?</p>
        <button onClick={() => deleteSeminar(editingSeminar.id)}>Да</button>
        <button onClick={closeModal}>Отмена</button>
      </div>
    </div>
  );
};

export default RemoveModal;
