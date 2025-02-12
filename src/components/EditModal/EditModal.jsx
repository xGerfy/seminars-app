import { formatDate } from "../../utils/formatDate";
import "./EditModal.css";

const EditModal = ({
  closeModal,
  editingSeminar,
  setEditingSeminar,
  setError,
  setSeminars,
  seminars,
}) => {
  // закрытие модалки при нажатии вне модалки
  const handleModalClick = (event) => {
    if (event.target.className === "modal") {
      closeModal();
    }
  };

  // запрос к бд для изменения семинара
  const handleEditSubmit = (event) => {
    event.preventDefault();
    const updatedSeminar = { ...editingSeminar };
    updatedSeminar.date = formatDate(updatedSeminar.date);
    fetch(`http://localhost:3000/seminars/${updatedSeminar.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedSeminar),
    })
      .then(() => {
        setSeminars(
          seminars.map((seminar) =>
            seminar.id === updatedSeminar.id ? updatedSeminar : seminar
          )
        );
        closeModal();
      })
      .catch((err) => setError(err));
  };

  return (
    <div className="modal" onClick={handleModalClick}>
      <form onSubmit={handleEditSubmit}>
        <input
          type="text"
          value={editingSeminar.title}
          onChange={(e) =>
            setEditingSeminar({ ...editingSeminar, title: e.target.value })
          }
          placeholder="Название семинара"
        />
        <input
          type="text"
          value={editingSeminar.description}
          onChange={(e) =>
            setEditingSeminar({
              ...editingSeminar,
              description: e.target.value,
            })
          }
          placeholder="Описание семинара"
        />
        <input
          type="date"
          value={editingSeminar.date}
          onChange={(e) =>
            setEditingSeminar({ ...editingSeminar, date: e.target.value })
          }
        />
        <input
          type="time"
          value={editingSeminar.time}
          onChange={(e) =>
            setEditingSeminar({ ...editingSeminar, time: e.target.value })
          }
        />
        <input
          type="text"
          value={editingSeminar.photo}
          onChange={(e) =>
            setEditingSeminar({ ...editingSeminar, photo: e.target.value })
          }
          placeholder="URL фото"
        />
        <button type="submit">Сохранить</button>
        <button type="button" onClick={closeModal}>
          Закрыть
        </button>
      </form>
    </div>
  );
};

export default EditModal;
