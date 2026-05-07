import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Detail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    
    // 1. Создаем стейт для данных мероприятия
    const [item, setItem] = useState({
        name: '',
        type: 'Внутреннее',
        venue: '',
        security: 'Low',
        status: 'На согласовании'
    });

    useEffect(() => {
        setIsLoading(true);
        axios.get(`https://69f9a9c1c509a40d3aa2f81c.mockapi.io/items/${id}`)
            .then(response => {
                // 2. Записываем данные в стейт. React сам обновит поля, когда уберем загрузку
                setItem(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Ошибка загрузки:", error);
                setIsLoading(false);
            });
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // 3. Отправляем текущее состояние item
        axios.put(`https://69f9a9c1c509a40d3aa2f81c.mockapi.io/items/${id}`, item)
            .then(() => navigate('/'))
            .catch(error => console.error("Ошибка обновления:", error));
    };

    if (isLoading) return <h2 style={{ padding: "20px" }}>Синхронизация данных...</h2>;

    return (
        <div style={{ padding: "20px" }}>
            <h1>Редактирование мероприятия</h1>
            <form onSubmit={handleSubmit}>
                <label>Название: <br/>
                    <input 
                        type="text" 
                        value={item.name || ''} 
                        onChange={(e) => setItem({...item, name: e.target.value})} 
                        required 
                    />
                </label><br/><br/>

                <label>Тип: <br/>
                    <select value={item.type} onChange={(e) => setItem({...item, type: e.target.value})}>
                        <option value="Внутреннее">Внутреннее</option>
                        <option value="Внешнее">Внешнее</option>
                    </select>
                </label><br/><br/>

                <label>Место проведения: <br/>
                    <input 
                        type="text" 
                        value={item.venue || ''} 
                        onChange={(e) => setItem({...item, venue: e.target.value})} 
                        required 
                    />
                </label><br/><br/>

                <label>Безопасность: <br/>
                    <select value={item.security} onChange={(e) => setItem({...item, security: e.target.value})}>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </label><br/><br/>

                <button type="submit">Сохранить</button>
                <button type="button" onClick={() => navigate('/')} style={{ marginLeft: "10px" }}>Отмена</button>
            </form>
        </div>
    );
};

export default Detail;