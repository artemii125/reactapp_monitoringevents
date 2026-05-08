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
      user: "b54afbc4658fa3",
      pass: "5df21a295ec78f"
    }
  });

  try {
    await transporter.sendMail({
      from: '"Система Мониторинга внутреннних и внешних мероприятий"',
      to: "larin.2024@stud.nstu.ru",
      subject: isDeletion ? `УДАЛЕНИЕ ОБЪЕКТА - ${name}` : `РЕГИСТРАЦИЯ ОБЪЕКТА - ${name}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6;">
          <h1 style="font-size: 20px; font-weight: normal; color: #000; margin-bottom: 30px; text-align: center;">
            ${isDeletion ? 'ОТЧЕТ ОБ ИСКЛЮЧЕНИИ ОБЪЕКТА' : 'ОТЧЕТ О РЕГИСТРАЦИИ ОБЪЕКТА'}
          </h1>
          
          <div style="padding: 0 20px;">
            <p style="margin: 5px 0;"><strong>Наименование:</strong> ${name}</p>
            <p style="margin: 5px 0;"><strong>Местоположение:</strong> ${venue}</p>
            <p style="margin: 5px 0;"><strong>Класс защиты:</strong> ${security}</p>
            <p style="margin: 5px 0;"><strong>Статус:</strong> ${isDeletion ? 'Удалено' : 'Активно'}</p>
          </div>

          <p style="margin-top: 40px; font-size: 11px; color: #777; text-align: center;">
            Сформировано системой автоматически: ${formattedDate}
          </p>
        </div>
      `
    });

    return res.status(200).json({ message: 'Success' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};