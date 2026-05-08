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
        <div style="max-width: 600px; margin: 0 auto; font-family: sans-serif; color: #000; line-height: 1.5;">
    <h1 style="font-size: 18px; font-weight: bold; margin-bottom: 20px; text-align: center;">
      ${isDeletion ? 'УВЕДОМЛЕНИЕ ОБ УДАЛЕНИИ МЕРОПРИЯТИЯ' : 'УВЕДОМЛЕНИЕ О РЕГИСТРАЦИИ МЕРОПРИЯТИЯ'}
    </h1>
    
    <div style="margin-bottom: 30px;">
      <p><strong>Наименование:</strong> ${name || 'Н/Д'}</p>
      <p><strong>Местоположение:</strong> ${venue || 'Н/Д'}</p>
      <p><strong>Класс защиты:</strong> ${security || 'Н/Д'}</p>
      <p><strong>Статус операции:</strong> ${isDeletion ? 'Удалено' : 'Зарегистрировано'}</p>
    </div>

    <p style="font-size: 11px; color: #666; text-align: center; border-top: 1px solid #eee; padding-top: 10px;">
      Сформировано автоматически: ${formattedDate}
    </p>
  </div>
`
    });

    return res.status(200).json({ message: 'Success' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};