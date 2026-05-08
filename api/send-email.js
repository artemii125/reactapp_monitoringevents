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
        <div style="max-width: 600px; margin: 20px auto; font-family: 'Courier New', Courier, monospace; color: #000; border: 1px solid #000; padding: 20px;">
          <h2 style="text-transform: uppercase; padding-bottom: 10px;">
            ${isDeletion ? 'Удалено мероприятие' : 'Зарегестрировано новое мероприятие'}
          </h2>
            <p><strong>Наименование:</strong> ${name}</p>
            <p><strong>Местоположение:</strong> ${venue}</p>
            <p><strong>Класс защиты:</strong> ${security}</p>
            <p><strong>Тип операции:</strong> ${isDeletion ? 'Исключение из реестра' : 'Внесение в реестр'}</p>
          </div>

            Системное время: ${formattedDate}
          </p>
        </div>
      `
    });

    return res.status(200).json({ message: 'Success' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};