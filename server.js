const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const MongoClient = require('mongodb').MongoClient;
const app = express();

const PORT = 3000;

// middleware - body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(path.join(__dirname, '/favicon.ico')));

MongoClient.connect(
  'mongodb+srv://m001-student:m001-mongodb-basics@sandbox.53gsr.mongodb.net/?retryWrites=true&w=majority',
  { useUnifiedTopology: true }
)
  .then((client) => {
    console.log('Connected to Database');
    const db = client.db('user-management-system');
    const users = db.collection('users');

    app.get('/', (req, res) => {
      db.collection('users').find().toArray()
        .then((results) => {
          console.log(results);
        })
        .catch(error => console.error(error))
      res.sendFile(path.join(__dirname, '/public', '/index.html'));
    });

    app.post('/users', (req, res) => {
      users.insertOne(req.body)
        .then(() => {
          console.log('User successfully created');
          res.redirect('/');
        })
        .catch((error) => console.error(error));
    });
  })
  .catch(console.error);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
