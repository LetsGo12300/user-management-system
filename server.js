const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');
const app = express();

const PORT = 3000;

// set EJS as template engine
app.set('view engine', 'ejs')

// middleware - body parser
app.use(express.static('public'))
app.use(bodyParser.json());
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
        .then((response) => {
          res.render('index.ejs', {users: response})
        })
        .catch(error => console.error(error))
    });

    // Create user
    app.post('/users', (req, res) => {
      users.insertOne(req.body)
        .then(() => {
          console.log('User successfully created');
          res.redirect('/');
        })
        .catch((error) => console.error(error));
    });

    // Edit user route + form
    app.get('/users/:id', (req, res) => {
      users.findOne({_id: ObjectId(req.params.id)})
        .then((response) => {
          res.render('edit.ejs', {user: response})
        })
    })

    // Accepting PUT request after editing user
    app.put('/update', (req, res) => {
      users.updateOne({_id: ObjectId(req.body._id)}, {$set: {name: req.body.name}})
        .then(() => {
          res.status(200)
        })
        .catch(error => console.error(error))
    })
  })
  .catch(console.error);

app.listen(PORT, () => {
  console.log(`App listening on port http://localhost:${PORT}`);
});
