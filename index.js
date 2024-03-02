const express = require('express');
const basicAuth = require('express-basic-auth');
const path = require('path');

const app = express();

const favicon = require('serve-favicon');
const faviconPath = path.join(__dirname, 'public', 'favicon.ico'); // Assuming it's in the public directory

app.use(favicon(faviconPath));

require('dotenv').config();
const mongoose = require("mongoose");
const TaskModel = require('./models/TaskModel');
const morgan = require('morgan');

// Create the Express app

// Connect to MongoDB
const server = app.listen(process.env.PORT, () => {
  console.log("Server listening");
  mongoose.connect(process.env.db_connection).then(() => {
    console.log("Database Connected");
  });
});

const authMiddleware = basicAuth({
  users: {
    admin: process.env.ADMIN_PASSWORD, // Replace with actual password stored securely
  },
  challenge: true,
});


app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  TaskModel.find({}).then((tasks) => {
    res.render('post.ejs', { todos: tasks });
  })
});

// Assuming you're using Express for routing

app.get('/post/', authMiddleware ,async (req, res) => {
  try {
    const tasks = await TaskModel.find(); // Fetch all tasks
    res.render('index.ejs', { todos: tasks }); // Render the post template with tasks data
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching tasks');
  }
});

app.get('/about/', (req, res) => {
  res.render('about.ejs');
});

app.get('/contact/', (req, res) => {
  res.render('contact.ejs');
});

// post contact form using contact_form.php
app.post('/contact_form.php/', (req, res) => {
  res.redirect('/contact_form.php');
});



app.post('/tasks/', async (req, res) => {
  const { task, name ,image ,likes } = req.body; // Destructure task and name from request body
  
  // Create a new task document with both task and name
  const newTask = new TaskModel({ task, name,image ,likes });
  
  try {
    await newTask.save();
    res.redirect('/'); // Redirect back to the main page
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating task');
  }
});

app.post('/tasks/:id/complete', (req, res) => {
  TaskModel.findById(req.params.id).then((todo) => {
    todo.is_completed = !todo.is_completed;
    todo.save();
    res.redirect('/');
  });
});

app.post('/tasks/:id/update', (req, res) => {
  TaskModel.findById(req.params.id).then((todo) => {
    todo.task = req.body.task;
    todo.name = req.body.name;
    todo.save();
    res.redirect('/');
  });
});

app.post('/tasks/:id/delete', (req, res) => {
  TaskModel.findByIdAndDelete(req.params.id).then(() => {
    res.redirect('/');
  });
});

app.post('/tasks/:id/like', (req, res) => {
  TaskModel.findById(req.params.id).then((todo) => {
    todo.likes++;
    todo.save();
    res.redirect('/');
  });
});

module.exports = {
  mongoose,
};