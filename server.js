const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const PORT = 3000;

// middleware - body parser
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public', '/index.html'));
});

app.post('/users', (req, res) => {
  console.log('User successfully created');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
