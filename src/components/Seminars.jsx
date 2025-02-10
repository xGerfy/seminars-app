import { useEffect, useState } from "react";

const Seminars = () => {
  // состояния для управления приложением
  // список семинаров
  const [seminars, setSeminars] = useState([]);
  // загрузка
  const [loading, setLoading] = useState(true);
  // ошибка
  const [error, setError] = useState(null);
  // изменение семинара
  const [editingSeminar, setEditingSeminar] = useState(null);
  // модальное окно
  const [modalVisible, setModalVisible] = useState(false);
  // подключаемся к бд при загрузке страницы (json-server)
  useEffect(() => {
    fetch("http://localhost:3000/seminars")
      .then((response) => response.json())
      .then((data) => {
        setSeminars(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);
  // функционал удаления семинара
  const deleteSeminar = (id) => {
    if (window.confirm("Вы уверены, что хотите удалить этот семинар?")) {
      fetch(`http://localhost:3000/seminars/${id}`, { method: "DELETE" })
        .then(() => {
          setSeminars(seminars.filter((seminar) => seminar.id !== id));
        })
        .catch((err) => setError(err));
    }
  };
  //открытие модалки для редактирования семинара
  const openEditModal = (seminar) => {
    setEditingSeminar(seminar);
    setModalVisible(true);
  };
  // закрытие модалки
  const closeModal = () => {
    setModalVisible(false);
    setEditingSeminar(null);
  };
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
  // вывод инфы о загрузке и ошибках
  if (loading) return <div className="loader">Загрузка...</div>;
  if (error)
    return (
      <div className="error">
        Ошибка: {error.message}. Что-то пошло не так 😢
      </div>
    );

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяцы начинаются с 0
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }

  // рендер
  return (
    <div className="container">
      <h1>Семинары</h1>
      <ul>
        {seminars.map((seminar) => (
          <li key={seminar.id}>
            <img src={seminar.photo} alt={seminar.title} />
            <div>
              <div>
                <h2>{seminar.title}</h2>
                <p>{seminar.description}</p>
              </div>
              <div>
                <p>Дата: {seminar.date}</p>
                <p>Время: {seminar.time}</p>
              </div>
            </div>
            <div>
              <button onClick={() => deleteSeminar(seminar.id)}>Удалить</button>
              <button onClick={() => openEditModal(seminar)}>
                Редактировать
              </button>
            </div>
          </li>
        ))}
      </ul>
      {/* модальное окно */}
      {modalVisible && (
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
      )}
    </div>
  );
};

export default Seminars;
