const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method == 'OPTIONS') {
    return res.status(200).end();
  }


  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Нужен метод POST' });
  }
  
  const { name, venue, security } = req.body;
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
      subject: `ALARM!!!!!! Новое мероприятие: ${name}`,
      html: `
        <h2>Зарегистрировано новое событие</h2>
        <p><b>Название:</b> ${name}</p>
        <p><b>Объект:</b> ${venue}</p>
        <p><b>Уровень безопасности:</b> ${security}</p>
        <hr /> 
      `
    });

    return res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};