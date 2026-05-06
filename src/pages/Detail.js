import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Detail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const nameRef = useRef(null);
    const typeRef = useRef(null);
    const venueRef = useRef(null);
    const securityRef = useRef(null);
    const statusRef = useRef(null);

    const capitalize = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    useEffect(() => {
        setIsLoading(true);
        axios.get(`https://69f9a9c1c509a40d3aa2f81c.mockapi.io/items/${id}`)
            .then(response => {
                const itemData = response.data;
                if (nameRef.current && typeRef.current) {
                    nameRef.current.value = itemData.name || '';
                    typeRef.current.value = itemData.type || '';
                    venueRef.current.value = itemData.venue || '';
                    securityRef.current.value = capitalize(itemData.security) || 'Low';
                    statusRef.current.value = itemData.status || 'На согласовании';
                }
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Ошибка загрузки:", error);
                setIsLoading(false);
            });
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedItem = {
            name: nameRef.current.value,
            type: typeRef.current.value,
            venue: venueRef.current.value,
            security: capitalize(securityRef.current.value),
            status: statusRef.current.value
        };

        axios.put(`https://69f9a9c1c509a40d3aa2f81c.mockapi.io/items/${id}`, updatedItem, {
            headers: { "Content-Type": "application/json" }
        })
            .then(() => navigate('/'))
            .catch(error => console.error("Ошибка обновления:", error));
    };

    if (isLoading) {
        return <h2 style={{ padding: "20px" }}>Загрузка...</h2>;
    }

    return (
        <div>
            <h1>Редактирование мероприятия</h1>
            <form onSubmit={handleSubmit}>
                <label>Название мероприятия: <input type="text" ref={nameRef} required /></label>
                <br /><br />
                <label>Тип мероприятия: <select ref={typeRef}>
                        <option value="Внутреннее">Внутреннее</option>
                        <option value="Внешнее">Внешнее</option>
                   </select>
                </label>
                <br /><br />
                <label>Место проведения: <input type="text" ref={venueRef} placeholder="Например: Конференц-зал" required />
                </label>
                <br /><br />
                <label>Уровень безопасности: <select ref={securityRef}>
                        <option value="Low">Low (Низкий)</option>
                        <option value="Medium">Medium (Средний)</option>
                        <option value="High">High (Высокий)</option>
                    </select>
                </label>
                <br /><br />
                <label>Статус мероприятия: <select ref={statusRef}>
                        <option value="На согласовании">На согласовании</option>
                        <option value="Утверждено">Утверждено</option>
                        <option value="В процессе">В процессе</option>
                        <option value="Завершено">Завершено</option>
                        <option value="Отклонено">Отклонено</option>
                    </select>
                </label>
                <br /><br />
                <button type="submit">Сохранить</button>
            </form>
        </div>
    );
};

export default Detail;
