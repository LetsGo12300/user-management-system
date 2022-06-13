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
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/")));

const roles = [
  'Administrator',
  'Primary Owner',
  'Editor',
  'Viewer'
];

MongoClient.connect(
  'mongodb+srv://m001-student:m001-mongodb-basics@sandbox.53gsr.mongodb.net/?retryWrites=true&w=majority',
  { useUnifiedTopology: true }
)
  .then((client) => {
    console.log('Connected to Database');
    const db = client.db('user-management-system');
    const users = db.collection('users');

    // Read users
    app.get('/', (req, res) => {
      db.collection('users').find().toArray()
        .then((response) => {
          res.render('index.ejs', {users: response, roles: roles})
        })
        .catch(error => console.error(error))
    });

    // Create user
    app.post('/api/users', (req, res) => {
      const newUser = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        status: req.body.status
      };
      
      users.insertOne(newUser)
        .then(() => {
          console.log('User successfully created');
          res.redirect('/');
        })
        .catch((error) => console.error(error));
    });

    // Read user and pre-fill form for updating
    app.get('/users/:id', (req, res) => {
      users.findOne({_id: ObjectId(req.params.id)})
        .then((data) => {
          if (!data){
            res.status(404).send('Error. User ID not found~')
          } else res.render('edit.ejs', {user: data, roles: roles})
        })
        .catch(() => {
          res.status(500).send({
            message: `Internal server error. Could not find user with id ${req.params.id}`
          })
        })
    })

    // Update user
    app.put('/api/update/:id', (req, res) => {
      const newUser = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        status: req.body.status
      };

      users.updateOne({_id: ObjectId(req.params.id)}, {$set: newUser})
        .then(() => {
          res.status(200).send({
            message: "User updated"
          })
        })
        .catch(() => {
          res.status(500).send({
            message: `Internal server error. Could not update user with id ${req.params.id}`
          })
        })
    })

    app.delete('/api/delete/:id', (req, res) => {
      users.deleteOne({_id: ObjectId(req.params.id)})
        .then((data) => {
          if (data.deletedCount !== 1){
            res.status(404).send({
              message: `User with ID ${req.params.id} not found`
            })
          } else {
            res.send({
              message: "User deleted!"
            })
          }
        })
        .catch(() => {
          res.status(500).send({
            message: `Internal server error. Could not delete user with id ${req.params.id}`
          })
        })
    })
  })
  .catch(console.error);

app.listen(PORT, () => {
  console.log(`App listening on port http://localhost:${PORT}`);
});
