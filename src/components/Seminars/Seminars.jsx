import { useEffect, useState } from "react";
import EditModal from "../EditModal/EditModal";
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
        <EditModal
          seminars={seminars}
          closeModal={closeModal}
          editingSeminar={editingSeminar}
          setEditingSeminar={setEditingSeminar}
          setError={setError}
          setSeminars={setSeminars}
        />
      )}
    </div>
  );
};

export default Seminars;
