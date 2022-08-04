const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', (_req, res) => {
  try {
    const talkers = JSON.parse(fs.readFileSync('./talker.json', 'UTF-8'));
    return res.status(HTTP_OK_STATUS).send(talkers);
  } catch (e) {
    return res.status(500).send('Algo deu errado');
  }
});

app.listen(PORT, () => {
  console.log('Online');
});
