import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Form = () => {
    const nameRef = useRef(null);
    const typeRef = useRef(null);
    const venueRef = useRef(null);
    const securityRef = useRef(null);
    const statusRef = useRef(null);
    
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const capitalize = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;
        setIsSubmitting(true);
        
        let createdId = null;

        const newItemData = { 
            name: nameRef.current.value, 
            type: typeRef.current.value,
            venue: venueRef.current.value,
            security: capitalize(securityRef.current.value),
            status: statusRef.current.value 
        };

        try {
            const dbResponse = await axios.post('https://69f9a9c1c509a40d3aa2f81c.mockapi.io/items', newItemData);
            createdId = dbResponse.data.id;
            console.log("Данные в базе");

            await axios.post('/api/send-email', {
                ...newItemData, 
                action: 'create'
            });
            console.log("Уведомление успешно отправлено");

            navigate('/');

        } catch (error) {
            console.error("Ошибка создания:", error);

            if (createdId) {
                await axios.delete(`${dbUrl}/${createdId}`);
                alert("Ошибка уведомления. Операция отменена, запись удалена из системы.");
            } else {
                alert("Ошибка соединения с сервером базы данных.");
            }
        } finally {
            setIsSubmitting(false);
        }
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
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </label>
                <br /><br />

                <label>
                    Cтатус: <br/>
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
                <button type="button" onClick={() => navigate('/')} style={{ marginLeft: "10px" }}>Назад</button>
            </form>
        </div>
    );
};

export default Form;
