const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { name, venue, security, action } = req.body;
  const isDeletion = action === 'delete';
  const now = new Date();
  const formattedDate = now.toLocaleString('ru-RU');

  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "ae934a81ba7d77",
      pass: "37d7864a99725b"
    }
  });

  try {
    const info = await transporter.sendMail({
      from: '"Система Мониторинга" <noreply@security.ru>',
      to: "larin.2024@stud.nstu.ru",
      subject: isDeletion ? `УДАЛЕНИЕ: ${name}` : `СОЗДАНИЕ: ${name}`,
      text: `Объект: ${name}, Место: ${venue}, Дата: ${formattedDate}`,
      html: `<b>Объект:</b> ${name}<br><b>Место:</b> ${venue}<br><b>Статус:</b> ${isDeletion ? 'Удалено' : 'Создано'}`
    });

    console.log("Email sent: " + info.response);
    return res.status(200).json({ success: true, info: info.response });

  } catch (error) {
    console.error("ОШИБКА ПОЧТЫ:", error);
    return res.status(500).json({ 
      error: "Ошибка на сервере почты", 
      details: error.message
    });
  }
};