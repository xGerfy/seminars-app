import { useEffect, useState } from "react";
import EditModal from "../EditModal/EditModal";
import RemoveModal from "../RemoveModal/RemoveModal";
import "./Seminars.css";

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
  // модальное окно редактирования
  const [editModalVisible, setEditModalVisible] = useState(false);
  // модальное окно удаления
  const [removeModalVisible, setRemoveModalVisible] = useState(false);

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

  //открытие модалки для редактирования семинара
  const openEditModal = (seminar) => {
    setEditingSeminar(seminar);
    setEditModalVisible(true);
  };

  // открытие модалки для удаления семинара
  const openRemoveModal = (seminar) => {
    setEditingSeminar(seminar);
    setRemoveModalVisible(true);
  };

  // закрытие модалки
  const closeModal = () => {
    setEditModalVisible(false);
    setRemoveModalVisible(false);
    setEditingSeminar(null);
  };

  // закрытие модалки при нажатии вне модалки
  const handleModalClick = (event) => {
    if (event.target.className === "modal") {
      closeModal();
    }
  };

  // вывод инфы о загрузке и ошибках
  if (loading) return <div className="loader">Загрузка...</div>;
  if (error)
    return (
      <div className="error">
        Ошибка: {error.message}. Что-то пошло не так 😢
      </div>
    );

  // рендер
  return (
    <div className="container">
      <h1 className="section__title">Семинары</h1>
      {seminars.length === 0 ? (
        <p className="no__seminars">Семинаров нет 😢</p>
      ) : (
        <ul className="seminars__list">
          {seminars.map((seminar) => (
            <li key={seminar.id} className="seminars__list-item">
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
                <button onClick={() => openRemoveModal(seminar)}>
                  Удалить
                </button>
                <button onClick={() => openEditModal(seminar)}>
                  Редактировать
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* модальное окно редактирования */}
      {editModalVisible && (
        <EditModal
          seminars={seminars}
          handleModalClick={handleModalClick}
          closeModal={closeModal}
          editingSeminar={editingSeminar}
          setEditingSeminar={setEditingSeminar}
          setError={setError}
          setSeminars={setSeminars}
        />
      )}

      {/* модальное окно удаления */}
      {removeModalVisible && (
        <RemoveModal
          editingSeminar={editingSeminar}
          seminars={seminars}
          handleModalClick={handleModalClick}
          closeModal={closeModal}
          setError={setError}
          setSeminars={setSeminars}
        />
      )}
    </div>
  );
};

export default Seminars;
