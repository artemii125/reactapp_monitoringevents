import React, { useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Form = () => {
    const nameRef = useRef(null);
    const typeRef = useRef(null);
    const venueRef = useRef(null);
    const securityRef = useRef(null);
    const statusRef = useRef(null);
    
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const newItemData = { 
            name: nameRef.current.value, 
            type: typeRef.current.value,
            venue: venueRef.current.value,
            security: securityRef.current.value,
            status: statusRef.current.value 
        };

        axios.post('http://localhost:5000/items', JSON.stringify(newItemData), {
            headers: { "Content-Type": "application/json" }
        })
            .then(() => {
                console.log("Мероприятие успешно создано");
                navigate('/');
            })
            .catch(error => console.error("Ошибка создания:", error));
    };

    return (
        <div>
            <h1>Регистрация нового мероприятия</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Название мероприятия: <br/>
                    <input type="text" ref={nameRef} required />
                </label>
                <br /><br />
                
                <label>
                    Тип: <br/>
                    <select ref={typeRef}>
                        <option value="Внутреннее">Внутреннее</option>
                        <option value="Внешнее">Внешнее</option>
                    </select>
                </label>
                <br /><br />
                <label>Место проведения: <br/>
                    <input type="text" ref={venueRef} placeholder="Например: Конференц-зал" required />
                </label>
                <br /><br />
                <label>
                    Уровень безопасности: <br/>
                    <select ref={securityRef}>
                        <option value="low">Low (Низкий)</option>
                        <option value="medium">Medium (Средний)</option>
                        <option value="high">High (Высокий)</option>
                    </select>
                </label>
                <br /><br />

                <label>
                    Начальный статус: <br/>
                    <select ref={statusRef} required>
                        <option value="На согласовании">На согласовании</option>
                        <option value="Утверждено">Утверждено</option>
                        <option value="В процессе">В процессе</option>
                        <option value="Завершено">Завершено</option>
                        <option value="Отклонено">Отклонено</option>
                    </select>
                </label>
                <br /><br />

                <button type="submit">Добавить</button>
            </form>
        </div>
    );
};

export default Form;