const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method == 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Нужен метод POST' });
  }
  
  const { name, venue, security, action } = req.body;
  const isDeletion = action === 'delete';
  const now = new Date();
  const formattedDate = now.toLocaleString('ru-RU');

  //настройка транспорта
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "b54afbc4658fa3",
      pass: "5df21a295ec78f"
    }
  });

  try {
    //отправка письма
    await transporter.sendMail({
      from: '"Система Мониторинга" <noreply@security.ru>',
      to: "larin.2024@stud.nstu.ru",
      subject: isDeletion ? `ALARM!!!!! Удалено мероприятие: ${name}` : `ALARM!!!!!! Новое мероприятие: ${name}`,
      html: `
        <div style="background-color: #f4f4f4; padding: 40px 0; font-family: sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 12px; border: 2px solid; box-shadow: 0 4px 10px rgba(0,0,0,0.1); text-align: center;">
            <h2> margin-bottom: 25px; font-size: 24px;"> ${isDeletion ? 'Мероприятие удалено из системы' : 'Зарегистрировано новое событие'}</h2>
            <div style="display: inline-block; text-align: left; background: #f9f9f9; padding: 20px; border-radius: 8px; width: 80%;">
              <p style="margin: 10px 0;"><strong>Название:</strong> ${name}</p>
              <p style="margin: 10px 0;"><strong>Объект:</strong> ${venue}</p>
              <p style="margin: 10px 0;"><strong>Уровень безопасности:</strong> ${security}</p>
            </div> 
          <div>
        <div>
      `
    });

    return res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};