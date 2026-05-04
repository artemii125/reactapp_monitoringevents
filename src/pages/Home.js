import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/items")
      .then(response => {
        setData(response.data);
        console.log("Данные загружены:", response.data);
      })
      .catch(error => console.error("Ошибка запроса:", error));
  }, []);

  function deleteItem(id) {
    axios.delete(`http://localhost:5000/items/${id}`)
      .then(() => {
        console.log(`Мероприятие ${id} удалено`);
        setData(data.filter(item => item.id !== id));
      })
      .catch(error => console.error("Ошибка удаления:", error));
  }

  const getSecurityColor = (security) => {
    const level = (security || '').toLowerCase();
    if (level === 'high') return 'red';
    if (level === 'medium') return 'orange';
    return 'green';
  };

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
                      [{item.security}]
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