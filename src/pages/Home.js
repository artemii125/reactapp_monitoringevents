import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  useEffect(() => {
    setIsLoading(true);
    axios.get("https://69f9a9c1c509a40d3aa2f81c.mockapi.io/items")
      .then(response => {
        setData(response.data);
        setIsLoading(false);
        console.log("Данные загружены:", response.data);
      })
      .catch(error => {
        console.error("Ошибка запроса:", error);
        setIsLoading(false);
      });
  }, []);

  function deleteItem(id) {
    const originalData = [...data];
    setData(prevData => prevData.filter(item => item.id !== id));
    axios.delete(`https://69f9a9c1c509a40d3aa2f81c.mockapi.io/items/${id}`)
      .then(() => {
        console.log(`Мероприятие ${id} удалено`);
      })
      .catch(error => {
        console.error("Ошибка удаления:", error);
        setData(originalData);
        alert("Не удалось удалить мероприятие. Пожалуйста, попробуйте снова.");
      });
  }

  const getSecurityColor = (security) => {
    const level = (security || '').toLowerCase();
    if (level === 'high') return 'red';
    if (level === 'medium') return 'orange';
    return 'green';
  };

  if (isLoading) {
    return <div style={{ padding: "20px" }}>Загрузка...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Список мероприятий</h1>
      <ul style={{ padding: 0 }}>
        {data.map(item => (
          <li key={item.id} style={{ marginBottom: "15px", listStyleType: "none" }}>
            <Link to={`/detail/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}> 
                <span style={{ fontSize: "1.1em", fontWeight: "500" }}>{item.name}</span>
                {" — "}
                <b>{item.status}</b> 
                
                <div style={{ marginLeft: "20px", color: "grey", fontSize: "0.9em" }}>
                  <span>Тип: {item.type}</span>
                  <span style={{ margin: "0 10px" }}>|</span>
                  <span>Объект: {item.venue}</span>
                  
                  <span style={{ 
                      marginLeft: "15px", 
                      color: getSecurityColor(item.security),
                      fontWeight: "bold"
                  }}>
                      [{capitalize(item.security)}]
                  </span>
                </div>
            </Link>
            <button onClick={() => deleteItem(item.id)} style={{ marginTop: "5px", cursor: "pointer" }}>
              Удалить
            </button>
            <hr style={{ opacity: "0.2", marginTop: "10px" }} />
          </li>
        ))}
      </ul>
      <br />
      <Link to="/add" style={{ fontWeight: "bold", textDecoration: "none", color: 'blue' }}>
        * Добавить мероприятие
      </Link>
    </div>
  );
};

export default Home;
