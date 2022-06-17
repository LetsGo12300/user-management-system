const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const {format} = require('date-fns');
const app = express();

// Require model
const User = require('./models/User');

const PORT = process.env.PORT || 3000;

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

mongoose.connect(
  'mongodb+srv://m001-student:m001-mongodb-basics@sandbox.53gsr.mongodb.net/UserManagementSystem?retryWrites=true&w=majority',
  { useUnifiedTopology: true }
)

// Check connection to database
const db = mongoose.connection
db.once('open', _ => {
  console.log('Connected to Database')
})
db.on('error', err => {
  console.error('connection error:', err)
})

// Read users
app.get('/', (req, res) => {
  User.find()
  .then((response) => {
    res.render('index.ejs', {users: response, roles: roles})
  })
  .catch(error => console.error(error))
});

// Create user
app.post('/api/users', (req, res) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    status: req.body.status
  });
  
  newUser.save()
  .then(() => {
    console.log('User successfully created');
    res.redirect('/');
  })
  .catch((error) => console.error(error));
});

// Read user and pre-fill form for updating
app.get('/users/:id', (req, res) => {
  User.findOne({_id: ObjectId(req.params.id)})
  .then((data) => {
    if (!data){
      res.status(404).send('Error. User ID not found~')
    } else {
      const date = format(data.lastUpdatedOn,'MMMM d, yyyy h:mm aaa');
      res.render('edit.ejs', {user: data, roles: roles, date: date})
    }
  })
  .catch(() => {
    res.status(500).send({
      message: `Internal server error. Could not find user with id ${req.params.id}`
    })
  })
})

// Update user
app.put('/api/update/:id', (req, res) => {
  User.findOne({_id: ObjectId(req.params.id)})
  .then((data) => {
      data.name = req.body.name;
      data.email = req.body.email;
      data.role = req.body.role;
      data.status = req.body.status;
      data.lastUpdatedOn = Date.now();
      data.save()
  })
  .then(() => {
    res.status(200).send({
      message: "User successfully updated!"
    })
  })
  .catch(() => {
    res.status(500).send({
      message: `Internal server error. Could not update user with id ${req.params.id}`
    })
  })
})

app.delete('/api/delete/:id', (req, res) => {
  User.findByIdAndDelete(ObjectId(req.params.id))
  .then((data) => {
    if (!data){
      res.status(404).send({
        message: `User with ID ${req.params.id} not found`
      })
    } else {
      res.send({
        message: "User successfully deleted!"
      })
    }
  })
  .catch(() => {
    res.status(500).send({
      message: `Internal server error. Could not delete user with id ${req.params.id}`
    })
  })
})

app.listen(PORT, () => {
  console.log(`App listening on port http://localhost:${PORT}`);
});
